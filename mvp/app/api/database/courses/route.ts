import { NextResponse } from "next/server";
import { supabase as client } from "../../client";

export const runtime = "edge";

export async function GET() {
    /*
    Returns 20 items from the database at specified offset.
    */
    try {
        const {data : courses, error} = await client.from("courses").select("*").limit(20);
        return NextResponse.json(courses);
    }
    catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}