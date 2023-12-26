'use client';

import { Database } from "@/types"
import ButtonBase from "@mui/material/ButtonBase";
import { useState } from "react";

export default function DatabaseItem({ title, course, id}: Database) {
    const [isClicked, setIsClicked] = useState(false);

    return (
        <ButtonBase
            key={id}
            className={`flex items-center rounded-lg p-4 m-2 shadow outline outline-1 ${isClicked ? 'bg-gray-200 hover:bg-gray-300 outline-gray-300' : 'hover:bg-gray-100 outline-gray-200'}`}
            onClick={() => setIsClicked(!isClicked)}
        >
            <div className="flex flex-col">
                <div className={`font-bold ${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>{title}</div>
                <div className={`${isClicked ? 'text-gray-700' : 'text-gray-500'}`}>{course}</div>
            </div>
        </ButtonBase>
    )
}
