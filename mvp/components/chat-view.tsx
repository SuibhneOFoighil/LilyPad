'use client';

import { useChat } from 'ai/react';
import type { Message } from 'ai';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBroom } from "@fortawesome/free-solid-svg-icons"
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import type { FormEvent } from "react";
import {  } from '@/types/client';
import { ChatRequestOptions } from 'ai';

import { faCircle } from '@fortawesome/free-solid-svg-icons';

import { File, FileCitation, CitedFile, ItemsDatabase } from '@/types/client';

import { FlowerIcon, UserIcon, SquareStackIcon } from '@/public/icons'

export default function ChatView({itemsDatabase, setSourceViewer}: {
    itemsDatabase: ItemsDatabase,
    setSourceViewer: React.Dispatch<React.SetStateAction<File | null>>,
}) {

    const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});
    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    const { 
      messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } = useChat({
        api: "api/chat",
        onResponse(response) {
          const citationsHeader = response.headers.get("x-citations");
          const citations = citationsHeader ? JSON.parse(Buffer.from(citationsHeader, "base64").toString()) : [];
          const messageIndexHeader = response.headers.get("x-message-index");
          if (citations.length && messageIndexHeader !== null) {
              const sources: CitedFile[] = citations.map((citation: FileCitation) => {
                  const file_id = citation.file_id;
                  const file = itemsDatabase.getFileById(file_id);
                  return {
                      ...file,
                      citation: citation,
                  }
              }, []);
            // console.log(sources);
            setSourcesForMessages({...sourcesForMessages, [messageIndexHeader]: sources});
            setIsStreaming(true);
          }
        },
        onError(error) {
          console.log(error);      
        },
        onFinish() {
          setInput('');
          setIsStreaming(false);
        }
    });

    async function sendMessage(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (chatEndpointIsLoading) {
        return;
      }
      if (input === '') {
        return;
      }
      const selectedFileIds = itemsDatabase.getSelectedFileIds();
      const selectedCourseIds = itemsDatabase.getSelectedCourseIds();
      const options: ChatRequestOptions = {
        options: {
          body: {
            selectedFileIds: selectedFileIds,
            selectedCourseIds: selectedCourseIds,
          },
        }
      };
      handleSubmit(e, options);
    }

    return (
      <div className='bg-container'>

        <div className='absolute right-0 top-0 h-[50px] flex items-center px-4'>
          <Tooltip title="Clear chat">
            <button onClick={() => setMessages([])}>
              <FontAwesomeIcon icon={faBroom} className='text-gray-500 hover:text-gray-800' />
            </button>
          </Tooltip>
        </div>

          
        {/* chat history */}
        <div id="chatbox" className="flex flex-col px-2 mb-20">
            {
              messages.map((message: Message, index: number) => {
                
                const chatBubbleProps = {
                  message: message,
                  sources: sourcesForMessages[index.toString()],
                  setSourceViewer: setSourceViewer,
                }

                return <ChatBubble key={index} {...chatBubbleProps} />
              })
            }
        </div>

        {/* chat input */}
        <div className="flex justify-center">
          <div className="mx-4 shadow shadow-primary rounded-lg fixed bottom-5 w-2/5 bg-white hover:bg-gray-100 outline outline-1 outline-gray-200">
            <form 
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
              {chatEndpointIsLoading ? <LoadingIcon /> : <SendButton />}
            </form>
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

function ChatBubble({
  message,
  sources,
  setSourceViewer,
}: {
  message: Message,
  sources?: CitedFile[] | undefined,
  setSourceViewer: React.Dispatch<React.SetStateAction<File | null>>,
}) {

  const { content, role } = message
  let profile = null
  let isAssistant = role === 'assistant'

  if (isAssistant) {
    profile = <div className="flex flex-shrink-0 items-center justify-center bg-primary rounded w-[36px] h-[36px]">
      <FlowerIcon className="w-6 h-6" />
    </div>
  } else {
    profile = <div className="flex flex-shrink-0 items-center justify-center bg-container rounded w-[36px] h-[36px]">
      <UserIcon className="w-6 h-6" />
    </div>
  }

  return (
    <>
      {/*  message  */}
      <div className="flex flex-col p-4">
        <div className="flex gap-4">
          {profile}
          <div className="whitespace-pre-wrap py-1">
            { isAssistant ? <h1 className="font-bold text-lg pb-2">Answer</h1> : null }
            <p>{content}</p>
          </div>
        </div>
        {/* sources */}
        { isAssistant && sources && sources?.length > 0 &&
          <div className='pt-5'>
            <div className='flex gap-4'>
              <div className="flex flex-shrink-0 items-center justify-center bg-container rounded w-[36px] h-[36px]">
                <SquareStackIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg py-1">Sources</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2'>
                {sources?.map((src: CitedFile, i: number) => {
                  const citation_number = src.citation.number;
                  const content_name = src.name;
                  const displayedTitle = content_name.length > 100 ? content_name.substring(0, 100) + '...' : content_name
                  return (
                    <button
                    key={i} 
                    className='p-4 rounded-lg shadow hover:bg-gray-100 outline outline-1 outline-gray-200 flex-col justify-between'
                    onClick={() => {
                      setSourceViewer(src);
                    }}>
                      <div className='flex gap-2 h-full'>
                        <p className="text-med font-semibold">{citation_number}</p>
                        <div className='flex flex-col justify-between'>
                          <p className="text-sm italic">{displayedTitle}</p>
                        </div>
                      </div>
                    </button>
                      )
                    })}
               </div>
              </div>
            </div>
          </div>
         }
      </div>
        

    </>
  )
}