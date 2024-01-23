import { NextRequest, NextResponse } from "next/server";

import { supabase as client } from "../client";

export const runtime = "edge";

export async function POST(request: NextRequest) {
    /*
    Returns files from the database.
    @param {string} search - the query to search for in the content of the files
    */

    try {
        const body = await request.json();
        const {search: query} = body;
        if (!query) {
            const {data: files, error} = await client.from("files").select("*").limit(20);
            return NextResponse.json(files);
        }
        else {
            const {data: files, error} = await client.from("files").select("*").textSearch("file_content", query);
            return NextResponse.json(files);
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}

export async function GET() {
    /*
    Returns 20 files from the database at specified offset.
    */
    try {
        const {data : files, error} = await client.from("files").select("*").limit(20);
        return NextResponse.json(files);
    }
    catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}