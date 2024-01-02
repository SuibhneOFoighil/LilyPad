// import Markdown from 'react-markdown'
import { FlowerIcon, UserIcon, SquareStackIcon } from '@/public/icons'
import { Message } from 'ai';

export default function ChatBubble({ message, sources }: {message: Message, sources: any[]}) {
  let { content, role } = message
  let profile;
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
        { isAssistant && sources?.length > 0 &&
          <div className='pt-5'>
            <div className='flex gap-4'>
              <div className="flex flex-shrink-0 items-center justify-center bg-container rounded w-[36px] h-[36px]">
                <SquareStackIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg py-1">Sources</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2'>
                {sources?.map((src) => {
                  const { citationNumber, pageContent, metadata } = src
                  const { title } = metadata
                  return (
                    <button className='p-4 rounded-lg shadow'>
                      <div className='text-lg font-bold text-sm'>{title}</div>
                      <div className='text-sm'>{pageContent}</div>
                      <div className='text-lg font-bold text-gray-500'>{citationNumber}</div>
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