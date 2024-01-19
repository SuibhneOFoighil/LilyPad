import { NextResponse, NextRequest } from "next/server";
import { supabase as client } from "../client";

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

// export async function POST(req: NextRequest) {
//     /*
//     @param {NextRequest} req
//     @returns {NextResponse}
//     */
//     try {
//         const body = await req.json();
//         const select = body.select ?? "*";
//         const limit = body.limit ?? 20;
//         const {data : courses, error} = await client.from("courses").select(select).limit(limit);
//         return NextResponse.json(courses);
//     }
//     catch (error) {
//         console.log(error);
//         return NextResponse.error();
//     }
// }