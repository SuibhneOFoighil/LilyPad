"use client"

import { SearchIcon } from "@/public/icons"
import type { Course, Item, SelectedItemsLookup } from "@/types/client"
import { DatabaseLayoutType, DatabaseDataType } from "@/types/client"

import DatabaseItem from "./DatabaseItem"

import Tooltip from "@mui/material/Tooltip"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useState } from "react";

function getBodyFormatting(gridType: number) {
    switch (gridType) {
        case DatabaseLayoutType.Grid:
            return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-200';
        case DatabaseLayoutType.List:
            return 'flex flex-col gap-4 mt-5 pt-5 border-t border-gray-200';
        default:
            return 'flex flex-col gap-4 mt-5 pt-5 border-t border-gray-200';
    }
}

function getDatabaseBody(dataView: string | null, items: Item[], courses: Course[], invarientDataProps: any) {
    switch (dataView) {
        case DatabaseDataType.Files:
            return items.map((item: Item) => {
                const props = {...invarientDataProps, item: item};
                return <DatabaseItem key={item.id} type={DatabaseDataType.Files} {...props} />
            });
        case DatabaseDataType.Courses:
            return courses.map((course: Course) => {
                const props = {...invarientDataProps, course: course};
                return <DatabaseItem key={course.id} type={DatabaseDataType.Courses} {...props} />
            });
        default:
            return items.map((item: Item) => {
                const props = {...invarientDataProps, item: item};
                return <DatabaseItem key={item.id} type={DatabaseDataType.Files} {...props} />
            });
    }
}


const DatabaseView = ({
    items, courses, selectedItemsLookup, setSourceViewer,
}: {
    items: Item[],
    courses: Course[],
    selectedItemsLookup: SelectedItemsLookup,
    setSourceViewer: (source: Item) => void,
}) => {

    const [searchQuery, setSearchQuery ] = useState<string>('');
    const [dataView, setDataView] = useState<string | null>('files');
    const [gridType, setGridType] = useState<number>(DatabaseLayoutType.List);

    const bodyFormatting = getBodyFormatting(gridType);
    
    const invarientDataProps = {
        selectedItemsLookup: selectedItemsLookup,
        setSourceViewer: setSourceViewer,
        viewType: gridType,
    }

    const databaseBody = getDatabaseBody(dataView, items, courses, invarientDataProps);

    const handleInput = (
        event: React.MouseEvent<HTMLElement>,
        newView: string | null,
      ) => {
        if (newView !== null) {
          setDataView(newView);
        }
    };

    return (
        // database view
        <div className="bg-container p-4">
            {/* database navbar */}
            <div>
                <div className="w-full flex flex-row gap-4">
                    <form className="flex flex-row rounded-lg bg-white p-4 shadow hover:bg-gray-100 outline outline-1 outline-gray-200" onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <SearchIcon className="text-gray-400 w-5 h-5" />
                        <input
                            aria-label="Search"
                            className="flex-grow-3 ml-3 w-full border-none bg-transparent outline-none placeholder-gray-400"
                            placeholder="Search"
                            type="search"
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                        />
                    </form>

                    <div className='flex flex-col h-full'>
                        <ToggleButtonGroup
                            value={dataView}
                            exclusive
                            onChange={handleInput}
                            size="small"
                            className='rounded-lg h-full'>
                            <ToggleButton value="files" className='font-serif'>
                            files
                            </ToggleButton>
                            <ToggleButton value="courses" className='font-serif'>
                            courses
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
            </div>
            {/* Database Body' */}
            <div className={bodyFormatting}>  
                {databaseBody}
            </div>
        </div>
    )
}

export default DatabaseView;