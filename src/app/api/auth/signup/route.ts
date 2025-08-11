import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";





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
        const firstLetter=fullname.charAt(0).toUpperCase();
        const defaultAvatarUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/w_200,h_200,c_fill,r_max,co_white,g_center,l_text:Arial_100_bold:${firstLetter}/v1/avatar.png`;


        let imageUrl=defaultAvatarUrl
        if(image){
            const uploadResult=await cloudinary.uploader .upload(image,{
                folder:"profile-image",
            });
            imageUrl=uploadResult.secure_url;
        }

        //Create User
        const newUser=new User({
            fullname,
            email,
            password:hashedPassword,
            image:imageUrl||"",
        })
        await newUser.save();

     return NextResponse.json({message:"User Created Successfuly"},{status:201});
    }catch(error){
        console.error("[SIGNUP_ERROR]",error);
            return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
 
    }
}