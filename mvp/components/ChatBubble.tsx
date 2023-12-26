import Markdown from 'react-markdown'
import { FlowerIcon, UserIcon } from '@/public/icons'

export default function ChatBubble({ role, content, type = "message" }: {role: string, content: string, type?: string}) {
  let bubbleClass = ''
  let profile = <div className="flex flex-shrink-0 items-center justify-center bg-container rounded w-[36px] h-[36px]">
    <UserIcon className="w-6 h-6" />
  </div>
  if (role === 'assistant') {
    bubbleClass = 'bg-container rounded-lg bg-green-100'
    profile = <div className="flex flex-shrink-0 items-center justify-center bg-primary rounded w-[36px] h-[36px]">
      <FlowerIcon className="w-6 h-6" />
    </div>
  }

  return (
    <div className={`p-4 ${bubbleClass}`}>
      <div className="flex gap-4">
        {profile}
        <div className="whitespace-pre-wrap py-1">
              <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  )
}