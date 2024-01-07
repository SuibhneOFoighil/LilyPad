'use client';

import { useChat } from 'ai/react';
import { Message } from 'ai';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBroom } from "@fortawesome/free-solid-svg-icons"
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import type { FormEvent } from "react";
import { SelectedItemsLookup } from '@/types/client';
import { ChatRequestOptions } from 'ai';

import { faCircle } from '@fortawesome/free-solid-svg-icons';

import ChatBubble from './ChatBubble';

import type { Citation } from '@/types/client';

export default function ChatView(props: any) {

    const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { 
      messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } = useChat({
        api: "api/chat",
        onResponse(response) {
          const sourcesHeader = response.headers.get("x-sources");
          const sources: Citation[] = sourcesHeader ? JSON.parse(Buffer.from(sourcesHeader, "base64").toString()) : [];
          const messageIndexHeader = response.headers.get("x-message-index");
          if (sources.length && messageIndexHeader !== null) {
            setSourcesForMessages({...sourcesForMessages, [messageIndexHeader]: sources});
          }
        },
        onError(error) {
          console.log(error);
        },
        onFinish() {
          setIsLoading(false);
        }
    });

    async function sendMessage(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      console.log('send message');
      if (chatEndpointIsLoading) {
        return;
      }
      if (input === '') {
        return;
      }
      setIsLoading(true);
      const data: SelectedItemsLookup = props.selectedItems;
      const selectedIds = Object.keys(data).filter((id) => data[id]);
      const options: ChatRequestOptions = {
        options: {
          body: {
            itemIds: selectedIds,
          },
        }
      };
      handleSubmit(e, options);
    }

    return (
      <div className="pt-4">

        <div className='absolute right-0 top-0 h-[50px] flex items-center px-4'>
          <Tooltip title="Clear chat">
            <button onClick={() => setMessages([])}>
              <FontAwesomeIcon icon={faBroom} className='text-gray-500 hover:text-gray-800' />
            </button>
          </Tooltip>
        </div>

        <div className={'flex flex-col justify-between gap-5 w-full h-full overflow-hidden ${className}'}>
          
          {/* chat history */}
          <div id="chatbox" className="overflow-scroll flex-col px-4 gap-2">
              {
                messages.map((message: Message, index: number) => {
                  
                  const chatBubbleProps = {
                    message: message,
                    sources: sourcesForMessages[index.toString()],
                    setSourceViewer: props.setSourceViewer,
                  }
                  return <ChatBubble key={index} {...chatBubbleProps} />
                })
              }
              <div style={{ height: '90px' }}></div>
          </div>

          {/* chat input */}
          <div className="flex justify-center">
            <div className="mx-4 shadow shadow-primary rounded-lg fixed bottom-5 w-2/5 bg-white hover:bg-gray-100 outline outline-1 outline-gray-200">
              <form 
              key="1"
              onSubmit={sendMessage}
              className="flex">
                <input
                value={input}
                onChange={handleInputChange}
                aria-label="Type message"
                className="flex-grow px-4 py-4 text-on-container h-[56px] bg-transparent outline-none resize-none"
                placeholder="Type message"
                type="text"
                />
                { 
                  isLoading ?
                  <LoadingIcon /> :
                  <SendButton />
                }
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

  function LoadingIcon() {
  return (
    <Tooltip title="Loading...">
      <div className='flex items-center ml-4 px-4 text-gray-500 hover:text-gray-700 focus:outline-none'>
        <FontAwesomeIcon icon={faCircle} className='thinking' />
      </div>
    </Tooltip>
  );
}

const SendButton = () => {
  return (
    <Tooltip title="Send message">
      <button
      aria-label="Send message"
      className="ml-4 px-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      type="submit"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </Tooltip>
  )
}