import type { Item, Course, SelectedItemsLookup } from "@/types/client";
import { DatabaseDataType, DatabaseLayoutType } from "@/types/client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";

export default function DatabaseItem({ type, ...props}: {
    type: DatabaseDataType,
    item?: Item,
    course?: Course,
    selectedItemsLookup: SelectedItemsLookup,
    setSourceViewer: (source: Item) => void,
    viewType: DatabaseLayoutType,
}) {

    switch (type) {
        case DatabaseDataType.Files:
            return <FileItem {...props} />
        case DatabaseDataType.Courses:
            return <CourseItem {...props} />
        default:
            return <FileItem {...props} />
    }
}

function CourseItem({
    course, selectedItemsLookup, setSourceViewer, viewType
}: {
    course: Course,
    selectedItemsLookup: SelectedItemsLookup,
    setSourceViewer: (source: Item) => void,
    viewType: DatabaseLayoutType,
}) {

    const { id, name, description } = course;
    const [isClicked, setIsClicked] = useState(selectedItemsLookup.isSelected(course));
    const displayName: string = name.length > 50 ? name.slice(0, 50) + "..." : name
    const displayDescription: string = description.length > 100 ? description.slice(0, 100) + "..." : description

    return (
        <div
        key={id}
        className={`h-full relative rounded-lg p-4 shadow outline outline-1 cursor-pointer ${isClicked ? 'bg-gray-200 hover:bg-gray-300 outline-gray-300' : 'hover:bg-gray-100 outline-gray-200'}`}
        onClick={() => {
            setIsClicked(!isClicked);
            selectedItemsLookup.toggle(course)
        }}
        >
            <div className={`${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>
                {
                    viewType === DatabaseLayoutType.Grid ? (
                        <>
                            <p className="font-bold">{displayName}</p>
                            <p>{displayDescription}</p>
                            <Tooltip title="View Source" placement="top-start">
                                <button>
                                    <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="w-5 h-5 m-auto hover:text-gray-700 absolute bottom-5 right-5"
                                    />
                                </button>
                            </Tooltip>
                        </>
                    ) : (
                        <div className="flex flex-row justify-between">
                           <div className="flex flex-col">
                                <p className="font-bold">{displayName}</p>
                                <div className="flex flex-row">
                                    <p>{displayDescription}</p>
                                </div>
                            </div>
                            <Tooltip title="View Source">
                                <button>
                                    <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="w-5 h-5 m-auto hover:text-gray-700"
                                    />
                                </button>
                            </Tooltip>
                        </div>
                    )
                }
            </div>
        </div>
    )

}

function FileItem(props: any) {

    const { item, selectedItemsLookup, setSourceViewer, viewType } = props;
    const { id, content_name, author, course_name } = item;
    const [isClicked, setIsClicked] = useState(selectedItemsLookup.isSelected(item));
    const displayName: string = content_name.length > 50 ? content_name.slice(0, 50) + "..." : content_name

    return (
        <div
        key={id}
        className={`h-full relative rounded-lg p-4 shadow outline outline-1 cursor-pointer ${isClicked ? 'bg-gray-200 hover:bg-gray-300 outline-gray-300' : 'hover:bg-gray-100 outline-gray-200'}`}
        onClick={() => {
            setIsClicked(!isClicked);
            selectedItemsLookup.toggle(item)
        }}
        >
            <div className={`${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>
                {
                    viewType === DatabaseLayoutType.Grid ? (
                        <>
                            <p className="font-bold">{displayName}</p>
                            <p className="italic">{author}</p>
                            <p>{course_name}</p>
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
                        <div className="flex flex-row justify-between">
                           <div className="flex flex-col">
                                <p className="font-bold">{displayName}</p>
                                <div className="flex flex-row">
                                    <p className="italic">{author}</p>
                                    <p className="mx-1">|</p>
                                    <p>{course_name}</p>
                                </div>
                            </div>
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
                    )
                }

            </div>
        </div>
    )
}
