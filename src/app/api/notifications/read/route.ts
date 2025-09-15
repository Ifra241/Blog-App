import Notification from "@/lib/models/Notification";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest){
    try{
        await connectToDatabase();

        const{notificationId}=await req.json();

        if(!notificationId){return NextResponse.json({message:"Notification Required"},{status:400})
        }
    const updatedNotification=await Notification.findByIdAndUpdate(notificationId,{read:true},{new:true});
    return NextResponse.json(updatedNotification,{status:200});
    }catch(error){
         console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { message: "Failed to mark notification as read" },
      { status: 500 }
    );
    }
}