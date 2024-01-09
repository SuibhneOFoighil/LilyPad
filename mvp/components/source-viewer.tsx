import type { Item } from "@/types/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const DocumentSection = ({title, isOpen, body}: {title: string, isOpen: boolean, body: ReactJSXElement}) => {

  const [isExpanded, setExpanded] = useState<boolean>(isOpen);

  return (  
    <div className="flex flex-col mt-4">
      {/* header */}
      <div className="flex flex-row justify-between bg-gray-200">
        <p className="font-semibold">{title}</p>
        <button
        className="p-2"
        onClick={() => {
          setExpanded(!isExpanded);
        }}>
          <FontAwesomeIcon icon={isExpanded? faChevronDown : faChevronUp} />
        </button>
      </div>
      {/* body */}
      <div className={`${isExpanded ? '' : 'hidden'}`}>
        {body}
      </div>
    </div>
  )
}

export default function SourceViewer({...props}) {

  const source: Item = props.sourceViewer ;
  const setSourceViewer = props.setSourceViewer;
  
  const summaryBody = (
    <p>{source.content_summary}</p>
  )

  const sectionsBody = (
    <>
      {source.content_sections?.map((section, i) => {
        return (
          <div key={i} className="mt-2">
            <p className="font-semibold">{section.title}</p>
            <p>{section.summary}</p>
          </div>
        )
      })}
    </>
  )

  const sourceInfoBody = (
    <>
      <p>Filename: {source.file_name}</p>
      <p>Pages: {source.number_pages}</p>
      <p>Author: {source.author}</p>
      <p>Course: {source.course_name}</p>
      <iframe src={source.source_url} className="w-full h-300"></iframe>
    </>
  )

  return (
    <div className="flex flex-col bg-white p-4 h-full">

      {/* navagation header */}
      <div className="grid justify-items-end">
        <button onClick={() => {setSourceViewer(null)}}>
          <FontAwesomeIcon icon={faX} className="w-3 h-3" />
        </button>
      </div>

        {/* document */}
      <div className="mt-4 h-full">
        {/* header */}
        <div className="flex flex-col">
          <p className="font-semibold">{source.content_name}</p>
          <p className="italic">{source.author}</p>
          <p>{source.course_name}</p>
        </div>
        {/* summary */}
        <DocumentSection title="Summary" isOpen={true} body={summaryBody} />
        {/* sections */}
        <DocumentSection title="Sections" isOpen={false} body={sectionsBody} />
        {/* source info */}
        <DocumentSection title="Source Info" isOpen={false} body={sourceInfoBody} />
      </div>

    </div>
  )
}


function ArrowLeftIcon(props: any) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function FileIcon(props: any) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function VideoIcon(props: any) {
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}

function ChevronDownIcon(props: any) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
