'use client';

import { displayMessages } from "@/test/chathistory";
import { useChat } from 'ai/react';
import { Message } from 'ai';
import ChatBubble from "./ChatBubble";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBroom } from "@fortawesome/free-solid-svg-icons"
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

function clearChat() {
  console.log('clear chat');
}

export default function ChatView({ className }: {className: string}) {

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        initialMessages: displayMessages,
        initialInput: ''
    });

    return (
      <div className="pt-4">

        <div className='absolute right-0 top-0 h-[50px] flex items-center px-4'>
          <Tooltip title="Clear chat">
            <IconButton onClick={clearChat}>
              <FontAwesomeIcon icon={faBroom} className='text-gray-500 hover:text-gray-800' />
            </IconButton>
          </Tooltip>
        </div>

        <div className={'flex flex-col justify-between gap-5 w-full h-full overflow-hidden ${className}'}>
          
          {/* chat history */}
          <div id="chatbox" className="overflow-scroll flex-col px-4 gap-2">
              {messages.map((m: Message) => (<ChatBubble key={m.id} role={m.role} content={m.content} />))}
              <div style={{ height: '90px' }}></div>
          </div>

          {/* chat input */}
          <div className="flex justify-center">
            <div className="mx-4 shadow shadow-primary rounded-lg fixed bottom-5 w-2/5 bg-white hover:bg-gray-100 outline outline-1 outline-gray-200">
              <form 
              key="1"
              onSubmit={handleSubmit}
              className="flex">
                <input
                value={input}
                onChange={handleInputChange}
                aria-label="Type message"
                className="flex-grow px-4 py-4 text-on-container h-[56px] bg-transparent outline-none resize-none"
                placeholder="Type message"
                type="text"
                />
                <button
                aria-label="Send message"
                className="ml-4 px-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                type="submit"
                >
                    <SendIcon className="w-6 h-6" />
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

      

    );
}
  
  function SendIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    )
  }