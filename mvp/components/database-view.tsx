"use client"

import { SearchIcon } from "@/public/icons"
import { Item, Course, File, ItemsDatabase, DatabaseLayoutType, DatabaseDataType } from "@/types/client"

import Tooltip from "@mui/material/Tooltip"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import { JSX, useState } from "react";

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

function getDatabaseItems(searchQuery: string, dataType: DatabaseDataType) {
    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            search: searchQuery,
        })
    }
    let url = '';
    switch (dataType) {
        case DatabaseDataType.Files:
            url = '/api/files';
        case DatabaseDataType.Courses:
            url = '/api/courses';
        default:
            url = '/api/files';
    }
    return fetch(url, data).then((res) => res.json())
}

const DatabaseView = ({
    itemsDatabase, setSourceViewer,
}: {
    itemsDatabase: ItemsDatabase,
    setSourceViewer: (source: File) => void,
}) => {

    // console.log(itemsDatabase)

    const [gridType, setGridType] = useState<DatabaseLayoutType>(DatabaseLayoutType.List);
    const [dataType, setDataType] = useState<DatabaseDataType>(DatabaseDataType.Files);
    const [displayedItems, setDisplayedItems] = useState<Item[] | null>(itemsDatabase.get(dataType));

    const handleInput = (
        event: React.MouseEvent<HTMLElement>,
        type: DatabaseDataType | null,
      ) => {
        console.log("Handling input");
        if (type !== null) {
            setDataType(type);
            setDisplayedItems(itemsDatabase.get(type));
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const searchQuery = event.target.value;
        getDatabaseItems(searchQuery, dataType)
        .then((data) => {
            if (data !== null) {
                itemsDatabase.update(dataType, data);
            }
            setDisplayedItems(data);
        })
    }

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
                            onChange={(e) => handleSearch(e)}
                        />
                    </form>

                    <div className='flex flex-col h-full'>
                        <ToggleButtonGroup
                            value={dataType}
                            exclusive
                            onChange={handleInput}
                            size="small"
                            className='rounded-lg h-full'>
                            <ToggleButton value={DatabaseDataType.Files} className='font-serif'>
                            files
                            </ToggleButton>
                            <ToggleButton value={DatabaseDataType.Courses} className='font-serif'>
                            courses
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
            </div>
            {/* Database Body' */}
            <div className={getBodyFormatting(gridType)}>  
                {
                    displayedItems?.map((item: Item, i:number) => {
                        if (dataType === DatabaseDataType.Files) {
                            item = item as File;
                        }
                        else {
                            item = item as Course;
                        }
                        return <DatabaseItem key={i} item={item} type={dataType} {...{
                            layout: gridType,
                            setSourceViewer: setSourceViewer,
                            itemsDatabase: itemsDatabase,
                        }} />
                    })
                }
            </div>
        </div>
    )
}

function shorten_string(str: string, max_length: number) {
    if (str.length > max_length) {
        return str.slice(0, max_length) + '...';
    }
    return str;
}


const DatabaseItem = ({
    item, type, layout, setSourceViewer, itemsDatabase
}: {
    item: Course | File,
    type: DatabaseDataType,
    layout: DatabaseLayoutType,
    setSourceViewer: (source: Item) => void,
    itemsDatabase: ItemsDatabase,
}) => {

    const [isClicked, setIsClicked] = useState(itemsDatabase.isSelected(item));

    const displayedName = shorten_string(item.name, 150);
    const displayedDescription = shorten_string(item.description, 200);
    
    return (
        <div
        key={item.id}
        className={`h-full relative rounded-lg p-4 shadow outline outline-1 cursor-pointer ${isClicked ? 'bg-gray-200 hover:bg-gray-300 outline-gray-300' : 'hover:bg-gray-100 outline-gray-200'}`}
        >
            <div className={`${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>
                {
                    layout === DatabaseLayoutType.Grid ? (
                        <>
                            <p className="font-bold">{item.name}</p>
                            <p>{item.description}</p>
                            <Tooltip title="View Source" placement="top-start">
                                <button>
                                    <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="w-5 h-5 m-auto hover:text-gray-700 absolute bottom-5 right-5"
                                    onClick={() => {
                                        setSourceViewer(item);
                                    }}
                                    />
                                </button>
                            </Tooltip>
                        </>
                    ) : (
                        <div className="flex flex-row justify-between gap-3">
                           <div className="flex flex-col overflow-auto">
                                <p className="font-bold truncate ...">{displayedName}</p>
                                <p className="truncate ...">{displayedDescription}</p>
                            </div>
                            <div className="flex flex-row gap-3">
                                <Tooltip title="Add to Chat">
                                    <button>
                                        <FontAwesomeIcon
                                        icon={faPlusCircle}
                                        className="w-5 h-5 m-auto hover:text-gray-700"
                                        onClick={() => {
                                            setIsClicked(!isClicked);
                                            itemsDatabase.toggle(item);
                                        }}
                                        />
                                    </button>
                                </Tooltip>
                                <Tooltip title="View Source">
                                    <button>
                                        <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="w-5 h-5 m-auto hover:text-gray-700"
                                        onClick={() => {
                                            setSourceViewer(item);
                                        }}
                                        />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}


export default DatabaseView;