import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


function createCookie(token:string){
    return `token=${token};path=/;HttpOnly;${
        process.env.NODE_ENV==="production"?"Secure; " : ""
    } SameSite=Strict;Max-Age=${7*24*60*60}`;
}


export async function POST(request:Request){
    try{
        const{email,password}=await request.json();

        //validate inputs
        if(!email||!password){
            return NextResponse.json({message:"All fileds Required"},{status:400});
        }
        // connect DB
        await connectToDatabase();
        //check user exist

        const user=await User.findOne({email});
        if(!user){
            return NextResponse.json({message:"User Not Exist"},{status:401});
        }
        //Check verified
      //  if(!user.isVerified){
     //return NextResponse.json({ message: "Please verify your email first" }, { status: 403 });}


        // Compare password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return NextResponse.json({message:"Password Incorrect"},{status:401});
        }
        //Create JWT token
        const token= jwt.sign(
            {userId:user._id,email:user.email},
            process.env.JWT_SECRET!,
                  { expiresIn: "7d" }

        );
        //send token and user info
        const response= NextResponse.json({message:"Login successful",token, user:{
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic,
        },
    },{status:200});
    //set cookies
        response.headers.set("Set-Cookie", createCookie(token));

    return response;
    }catch(error){
        console.error("[LOGIN_ERROR]",error);
      return NextResponse.json({message:"Something went Wrong"},{status:500});
    }
}