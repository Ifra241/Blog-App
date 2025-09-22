import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){

    try{
        // Read email & OTP from request
        const{email,otp}=await req.json();
        // Validate input
        if(!email||!otp){
            return NextResponse.json({message:"Email and OTP are required"},{status:400});
        }
   
    await connectToDatabase();

    const user=await User.findOne({email});
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified" }, { status: 400 });
    }
    if(user.verificationCode !==otp){
        return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    if(user.verificationCodeExpiry<new Date()){
        return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }
    user.isVerified=true;
    user.verificationCode=undefined; // remove OTP
    user.verificationCodeExpiry=undefined;// remove expiry
    await user.save();
     return NextResponse.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("[VERIFY_OTP_ERROR]", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });

 }

}