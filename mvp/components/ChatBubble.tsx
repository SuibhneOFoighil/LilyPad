import { FlowerIcon, UserIcon, SquareStackIcon } from '@/public/icons'
import type { CitedItem } from '@/types/client';

export default function ChatBubble({ ...props}) {
  const { message, sources, setSourceViewer } = props
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
        { isAssistant && sources?.length > 0 &&
          <div className='pt-5'>
            <div className='flex gap-4'>
              <div className="flex flex-shrink-0 items-center justify-center bg-container rounded w-[36px] h-[36px]">
                <SquareStackIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg py-1">Sources</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2'>
                {sources?.map((src: CitedItem) => {
                  const {
                    citationNumber,
                    name,
                    author,
                  } = src
                  const displayedTitle = name.length > 50 ? name.substring(0, 50) + '...' : name
                  return (
                    <button 
                    className='p-4 rounded-lg shadow hover:bg-gray-100 outline outline-1 outline-gray-200 flex-col justify-between'
                    onClick={() => {
                      setSourceViewer(src);
                    }}>
                      <div className='flex gap-2 h-full'>
                        <p className="text-med font-semibold">{citationNumber}</p>
                        <div className='flex flex-col justify-between'>
                          <p className="text-sm">{displayedTitle}</p>
                          <p className="text-sm italic">{author}</p>
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