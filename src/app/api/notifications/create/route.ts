import Notification from "@/lib/models/Notification";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    await connectToDatabase();

    const{userId,message}=await req.json();
    if(!userId||!message)
        return NextResponse.json({message:"Missing data"},{status:400});

    try{
        const notif=await Notification.create({user:userId,message});
         return NextResponse.json(notif, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to create notification" }, { status: 500 });
  }
}
