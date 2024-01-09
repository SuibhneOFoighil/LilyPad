import { Item, SelectedItemsLookup } from "@/types/client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";

export default function DatabaseItem({ item, props}: {
    item: Item,
    props: {
        selectedItems: SelectedItemsLookup,
        setSelectedItems: (selectedItems: SelectedItemsLookup) => void,
        setSourceViewer: (source: Item) => void,
    }
}) {

    const { id, content_name, author, course_name } = item;
    const { selectedItems, setSelectedItems, setSourceViewer } = props;
    const [isClicked, setIsClicked] = useState(selectedItems[id]);
    const displayName: string = content_name.length > 50 ? content_name.slice(0, 50) + "..." : content_name

    return (
        <div
        key={id}
        className={`h-full relative rounded-lg p-4 shadow outline outline-1 cursor-pointer ${isClicked ? 'bg-gray-200 hover:bg-gray-300 outline-gray-300' : 'hover:bg-gray-100 outline-gray-200'}`}
        onClick={() => {
            setIsClicked(!isClicked);
            setSelectedItems({
                ...selectedItems,
                [id]: !isClicked,
            });
        }}
        >
            <div className={`${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>
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
            </div>
        </div>
    )
}
