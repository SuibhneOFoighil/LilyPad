import DatabaseView from "@/components/database-view"
import ChatView from "@/components/chat-view"
import { FlowerIcon } from "@/public/icons"

export default function Page() {
  return (
    <main className="font-serif">
      <header className='h-[50px] flex justify-center items-center gap-2 border-b'>
        <FlowerIcon className='w-6 h-6 text-primary' />
        <h1 className='text-lg'>LilyPad</h1>
      </header>
      <div className='flex h-[calc(100vh-50px)]'>
        <div className='relative flex-shrink-0 w-1/2 px-6 pb-6 overflow-y-auto'>
          <DatabaseView/>
        </div>
        <div className='w-1/2 border-l overflow-y-auto'>
          <ChatView className='w-full'/>
        </div>
      </div>
    </main>
  )
}