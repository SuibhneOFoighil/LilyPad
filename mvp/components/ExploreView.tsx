"use client";
import { useState } from "react";
import { Item, Course, SelectedItemsLookup } from "@/types/client";
import DatabaseView from "./database-view";
import ChatView from "./chat-view";
import SourceViewer from "./source-viewer";
import { init } from "next/dist/compiled/webpack/webpack";

const ExploreView = ({
    initItems, initCourses,
}: {
    initItems: Item[],
    initCourses: Course[],
}) => {

    const selectedItemsLookup: SelectedItemsLookup = new SelectedItemsLookup(
        initItems, initCourses
    );

    // console.log(selectedItemsLookup);

    const [items, setItems] = useState<Item[]>(
        initItems
    );

    const [courses, setCourses] = useState<Course[]>(
        initCourses
    );

    const [leftSourceViewer, setLeftSourceViewer] = useState<Item | null>(null);

    const [rightSourceViewer, setRightSourceViewer] = useState<Item | null>(null);

    const leftSourceViewerProps = {
        sourceViewer: leftSourceViewer,
        setSourceViewer: setLeftSourceViewer,
    }

    const rightSourceViewerProps = {
        sourceViewer: rightSourceViewer,
        setSourceViewer: setRightSourceViewer,
    }

    const databaseViewProps = {
        items: items,
        courses: courses,
        selectedItemsLookup: selectedItemsLookup,
        setSourceViewer: setRightSourceViewer,
    }

    const itemsLookup = items.reduce((acc: Record<string, Item>, item: Item) => {
        acc[item.id] = item;
        return acc;
    }
    , {});

    const chatViewProps = {
        itemsLookup: itemsLookup,
        selectedItemsLookup: selectedItemsLookup,
        setSourceViewer: setLeftSourceViewer,
    }

    return (
        <div className='flex h-[calc(100vh-50px)]'>
            <div className='relative flex-shrink-0 w-1/2 px-6 pb-6 overflow-y-auto'>
                {
                    leftSourceViewer ? 
                    <SourceViewer {...leftSourceViewerProps} /> :
                    <DatabaseView {...databaseViewProps} />
                }
            </div>
            
            {/* chat view */}
            <div className='w-1/2 border-l overflow-y-auto'>
                {
                    rightSourceViewer ?
                    <SourceViewer {...rightSourceViewerProps} /> :
                    <ChatView {...chatViewProps} />
                }
            </div>
        </div>
    );
}

// 

export default ExploreView;