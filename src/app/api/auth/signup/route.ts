import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";





export async function POST(request:Request){
    
    try{
        const{fullname,email,password,image}=await request.json();


        //validate Input
        if(!fullname||!email||!password){
            return NextResponse.json({message:"All fields are required"},{status:400});
        }
        
        //Connect DB
        await connectToDatabase();

        //check user already exists

        const userExists=await User.findOne({email});
        if(userExists){
            return NextResponse.json({message:"User Already exists"},{status:409});
        }
        //hashed password
        const hashedPassword=await bcrypt .hash(password,10);

        //Create User
        const newUser=new User({
            fullname,
            email,
            password:hashedPassword,
            image:image||"",
        })
        await newUser.save();

     return NextResponse.json({message:"User Created Successfuly"},{status:201});
    }catch(error){
        console.error("[SIGNUP_ERROR]",error);
            return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
 
    }
}