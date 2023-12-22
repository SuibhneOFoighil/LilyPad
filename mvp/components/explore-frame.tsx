import ChatView from "@/components/chat-view";
import DatabaseView from "@/components/database-view";

export default function ExploreFrame() {
    // two columns with a 1:1 ratio
    // left column holds the database view
    // right column holds the chat view

    // the database view is a list of dataitems
    // the dataitems are selectable
    // the dataitems are searchable
    // the dataitems are filterable

    // the chat view is a chat window with a chat input
    // the chat window is a list of chat messages
    return (
        <>
            <div className="flex flex-row">
                <div className="flex flex-col w-1/2">
                    <DatabaseView />
                </div>
                <div className="flex flex-col w-1/2">
                    <ChatView />
                </div>
            </div>
        </>
    )
}