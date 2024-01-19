"use client"

import type { Item, File, Course } from "@/types/client";
import { ItemsDatabase, DatabaseDataType } from "@/types/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export default function SourceViewer({
  sourceViewer, setSourceViewer, itemsDatabase
}: {
  sourceViewer: File | Course | null,
  setSourceViewer: (source: File | Course | null) => void,
  itemsDatabase: ItemsDatabase,
}) {

  // check if sourceViewer is a file or course
  const dataType = sourceViewer?.discriminator;
  const source = sourceViewer; //needs to opposite
  const similarItems = itemsDatabase.similar_items(source);
  console.log(similarItems);

  const similarItemsBody = (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-4">
      {similarItems?.map((item : Course | File, i) => {
        const itemNumber = i + 1;
        const displayedTitle = item.name?.length > 100 ? item.name.slice(0, 100) + "..." : item.name;
        return (
          <div key={i} 
          className="flex gap-2 h-full shadow hover:bg-gray-100 outline outline-1 outline-gray-200 rounded-lg p-4 cursor-pointer"
          onClick={() => {
            setSourceViewer(item); //needs to opposite
          }}>
            <p className="text-med font-semibold">{itemNumber}</p>
            <p className="text-sm italic text-center">{displayedTitle}</p>
          </div>
        )
      })}
    </div>
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
      <div className="py-4 px-6">
        {/* header */}
        <div className="flex flex-col">
          <p className="font-semibold">{source?.name}</p>
        </div>
        {/* description */}
        <ItemSection title="Description" isOpen={true} body={<p>{source?.description}</p>} />
        {/* variable document segments */}
        { dataType && dataType === DatabaseDataType.Files ? <FileBody file={source as File} /> : <CourseBody course={source as Course} /> }
        {/* similar sources footer */}
        { similarItems.length ? <ItemSection title="Similar Sources" isOpen={true} body={similarItemsBody} /> : null }
      </div>

    </div>
  )
}

const FileBody = ({file}: {file: File}) => {

  const sectionsBody = (
    <>
      {
        file.sections?.map((section, i) => {
          return (
            <div key={i} className="mt-2">
              <p className="font-semibold">{section.title}</p>
              <p>{section.summary}</p>
            </div>
          )
        })
      }
    </>
  )

  const sourceInfoBody = (
    <>
      <p>Filename: {file.file_name}</p>
      <p>Pages: {file.number_pages}</p>
      <p>Author: {file.author}</p>
      <p>Source Link: {file.source_url}</p>
    </>
  )

  return (
    <>
      {/* sections */}
      <ItemSection title="Sections" isOpen={true} body={sectionsBody} />
      {/* source info */}
      <ItemSection title="Source Info" isOpen={true} body={<p>{sourceInfoBody}</p>} />
    </>
  )
}

const CourseBody = ({course}: {course: Course}) => {
  return (
    <>
      {/* NOTHING YET */}
      {/* <ItemSection title="Summary" isOpen={true} body={<p>{course.description}</p>} /> */}
    </>
  )
}

const ItemSection = ({title, isOpen, body}: {title: string, isOpen: boolean, body: ReactJSXElement}) => {

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
