import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){

    await connectToDatabase();

    const userId=req.nextUrl.searchParams.get("userId");
    if(!userId){
        return NextResponse.json({message:"Missing UserId"},{status:400});
    }
    try{
        const user=await User.findById(userId).populate("savedBlogs");
        
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json( user.savedBlogs );
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err }, { status: 500 });
    }
}