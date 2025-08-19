import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import {  NextResponse } from "next/server";

export async function GET({params}:{params:{userId:string}}){
    try{
    await connectToDatabase();

    const{userId}=params;
    const user=await User.findById(userId).select("-email");
    if(!user)return NextResponse.json({error:"User Not Found"},{status:404});
    return NextResponse.json(user);
    }catch{
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}