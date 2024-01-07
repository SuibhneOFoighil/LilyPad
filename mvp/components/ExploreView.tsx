"use client";
import { useState } from "react";
import type { Item, SelectedItemsLookup } from "@/types/client";
import DatabaseNavbar from "./DatabaseNavbar";
import DatabaseItem from "./DatabaseItem";
import ChatView from "./chat-view";
import SourceViewer from "./source-viewer";

const ExploreView = ({initItems, selectedLookup}: {
    initItems: Item[],
    selectedLookup: SelectedItemsLookup,
}) => {

    const [items, setItems] = useState<Item[]>(
        initItems
    );
    
    const [sourceViewer, setSourceViewer] = useState<Item | null>(null);

    const [selectedItems, setSelectedItems] = useState<SelectedItemsLookup>(
        selectedLookup
    );

    const databaseItemProps = {
        items: items,
        selectedItems: selectedItems,
        setSelectedItems: setSelectedItems,
    }

    const databaseNavBarProps = {
        items: items,
        setItems: setItems,
        selectedItems: selectedItems,
        setSelectedItems: setSelectedItems,
    }

    const chatViewProps = {
        selectedItems: selectedItems,
        setSelectedItems: setSelectedItems,
        setSourceViewer: setSourceViewer,
    }

    const sourceViewerProps = {
        sourceViewer: sourceViewer,
        setSourceViewer: setSourceViewer,
    }

    return (
        <div className='flex h-[calc(100vh-50px)]'>
            <div className='relative flex-shrink-0 w-1/2 px-6 pb-6 overflow-y-auto'>
                {
                    sourceViewer ? 
                    <SourceViewer {...sourceViewerProps} /> :
                    // database view
                    <div className="bg-container p-4">
                        <DatabaseNavbar props={databaseNavBarProps}/>
                        {/* Database Body' */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-200">  
                            {items.map((i: Item, index: number) => (<DatabaseItem key={index} item={i} props={databaseItemProps} />))}
                        </div>
                    </div>
                }
            </div>
            
            {/* chat view */}
            <div className='w-1/2 border-l overflow-y-auto'>
                <ChatView {...chatViewProps} />
            </div>
        </div>
    );
}

export default ExploreView;