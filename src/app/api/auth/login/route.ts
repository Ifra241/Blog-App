import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";




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
        return NextResponse.json({message:"Login successful",token, user:{
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            image:user.image,
        },
    },{status:200});
    }catch(error){
        console.error("[LOGIN_ERROR]",error);
      return NextResponse.json({message:"Something went Wrong"},{status:500});
    }
}