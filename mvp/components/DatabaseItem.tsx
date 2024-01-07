'use client';

import { Item, SelectedItemsLookup } from "@/types/client";
import { useState } from "react";

export default function DatabaseItem({ item, props}: {
    item: Item,
    props: {
        selectedItems: SelectedItemsLookup,
        setSelectedItems: (selectedItems: SelectedItemsLookup) => void,
    }
}) {

    const { id, name, author, course } = item;
    const { selectedItems, setSelectedItems } = props;
    const [isClicked, setIsClicked] = useState(selectedItems[id]);
    const displayName: string = name.length > 30 ? name.slice(0, 30) + "..." : name

    return (
        <button
        key={id}
        className={`rounded-lg p-4 shadow outline outline-1 ${isClicked ? 'bg-gray-200 hover:bg-gray-300 outline-gray-300' : 'hover:bg-gray-100 outline-gray-200'}`}
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
                <p>{course}</p>
            </div>
        </button>
    )
}
