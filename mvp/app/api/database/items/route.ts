import { NextRequest, NextResponse } from "next/server";

import { supabase as client } from "../../client";

export const runtime = "edge";

export async function POST(request: NextRequest) {
    /*
    Returns items from the database.
    @param {string} query - the query to search for
    @param {number} limit - the number of items to return
    @param {number} offset - the offset to start returning items from
    */

    try {
        const body = await request.json();
        const {query, limit, offset} = body;
        if (!query && !limit && !offset) {
            client.from("items").select("*").limit(10).then((data) => {
                return NextResponse.json(data);
            });
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}

export async function GET() {
    /*
    Returns 20 items from the database at specified offset.
    */
    try {
        const {data : items, error} = await client.from("items").select("*").limit(20);
        return NextResponse.json(items);
    }
    catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}