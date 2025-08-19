import Blog from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export  async function GET({params}:{params:{userId:string}}){
    try{
        await connectToDatabase();
        const {userId}=params;
        const blogs=await Blog.find({author:userId}).sort({createdAt:-1});
         if (blogs.length===0) return NextResponse.json({ error: "blog not found" }, { status: 404 });
          return NextResponse.json(blogs);

    }catch{
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
} 