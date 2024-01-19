"use client";
import { useState } from "react";
import { Item, File, Course, ItemsDatabase } from "@/types/client";
import DatabaseView from "./database-view";
import ChatView from "./chat-view";
import SourceViewer from "./source-viewer";

const ExploreView = ({
    initFiles, initCourses,
}: {
    initFiles: File[],
    initCourses: Course[],
}) => {

    const [itemsDatabase] = useState<ItemsDatabase>(new ItemsDatabase(initFiles, initCourses));
    // const [items, setFiles] = useState<File[]>(initFiles);
    // const [courses, setCourses] = useState<Course[]>(initCourses);

    const [leftSourceViewer, setLeftSourceViewer] = useState<File | Course | null>(null);
    const [rightSourceViewer, setRightSourceViewer] = useState<File | Course | null>(null);

    const databaseViewProps = {
        itemsDatabase: itemsDatabase,
        setSourceViewer: setRightSourceViewer,
    }

    const chatViewProps = {
        itemsDatabase: itemsDatabase,
        setSourceViewer: setLeftSourceViewer,
    }

    const leftSourceViewerProps = {
        sourceViewer: leftSourceViewer,
        setSourceViewer: setLeftSourceViewer,
        itemsDatabase: itemsDatabase,
    }

    const rightSourceViewerProps = {
        sourceViewer: rightSourceViewer,
        setSourceViewer: setRightSourceViewer,
        itemsDatabase: itemsDatabase,
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