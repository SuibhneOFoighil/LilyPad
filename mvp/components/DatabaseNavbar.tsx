"use client";

import { SearchIcon } from "@/public/icons"

import ViewToggle from "./DatabaseToggle"
import type { SelectedItemsLookup } from "@/types/client"

import { createClient } from "@supabase/supabase-js";

import Tooltip from "@mui/material/Tooltip"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faCircleMinus } from "@fortawesome/free-solid-svg-icons"

import { useState } from "react"
import type { Item } from "@/types/client";

const DatabaseNavbar = (props: any) => {

    const { items, setItems, selectedItems, setSelectedItems } = props;
    const [ searchQuery, setSearchQuery ] = useState<string>('');

    function addDisplayedItems() {
        console.log('add selected items');
    }
    
    function clearSelectedItems() {
        console.log('clear selected items');
    }

    async function displaySearchItems() {
        console.log('Searching for items: ' + searchQuery)
        const client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_KEY!
        );
        const { data, error } = await client
        .from('items')
        .select()
        .textSearch('title', `${searchQuery}`)
        .limit(10);
        if (error) {
            console.log(error);
            return;
        }
        else {
            console.log('data');
            console.log(data);
            console.log('items');
            console.log(items)
            setItems(data);
            console.log('items');
            console.log(items)
        }
    }

    return (
    <div>
        <span className="flex">
            <form className="flex" onSubmit={(e) => {
                e.preventDefault();
                displaySearchItems();
                setSearchQuery('');
            }}>
                <div key="1" className="flex rounded-lg bg-white p-4 mx-4 shadow hover:bg-gray-100 outline outline-1 outline-gray-200">
                    <SearchIcon className="text-gray-400 w-5 h-5" />
                    <input
                        aria-label="Search"
                        className="ml-3 w-full border-none bg-transparent outline-none placeholder-gray-400"
                        placeholder="Search"
                        type="search"
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                    />
                </div>
            </form>
            {/* <ViewToggle /> */}
            {/* <Tooltip title="Add all" className="mx-1">
                <button onClick={() => addDisplayedItems()}>
                    <FontAwesomeIcon icon={faPlusCircle} className='text-gray-500 hover:text-gray-800 w-[20px] h-[20px]' />
                </button>
            </Tooltip>
            <Tooltip title="Remove all" className="mx-1">
                <button onClick={() => clearSelectedItems()}>
                    <FontAwesomeIcon icon={faCircleMinus} className='text-gray-500 hover:text-gray-800 w-[20px] h-[20px]' />
                </button>
            </Tooltip> */}
        </span>
    </div>
    )
}

export default DatabaseNavbar;