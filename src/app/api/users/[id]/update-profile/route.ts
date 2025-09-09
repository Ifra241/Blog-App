import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { id: string } }){
try{
    await connectToDatabase();

    const{id}=params;
    const data=await req.json();
      if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }
    const updatedUser=await User.findByIdAndUpdate(id,data,{new:true});
      if (!updatedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
  }
}