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

    const { id, title, subtitle } = item;
    const { selectedItems, setSelectedItems } = props;
    const [isClicked, setIsClicked] = useState(selectedItems[id]);

    return (
        <button
        key={id}
        className={`flex items-center rounded-lg p-4 shadow outline outline-1 ${isClicked ? 'bg-gray-200 hover:bg-gray-300 outline-gray-300' : 'hover:bg-gray-100 outline-gray-200'}`}
        onClick={() => {
            setIsClicked(!isClicked);
            setSelectedItems({
                ...selectedItems,
                [id]: !isClicked,
            });
        }}
        >
            <div className="flex flex-col">
                <div className={`font-bold ${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>{title}</div>
                <div className={`${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>{id}</div>
            </div>
        </button>
    )
}
