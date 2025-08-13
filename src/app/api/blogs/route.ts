import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Blog from "@/lib/models/Blog";

export async function POST(req:Request){
    try{
        await connectToDatabase();
        const body=await req.json();
        console.log("Received blog data:", body);


        if(!body.title||!body.content||!body.author){
            return NextResponse.json(
                { error:"Filed required" },{status:400}
            );
        }

const newBlog=await Blog.create({
    title:body.title,
    content:body.content,
    author:body.author,
image:body.image,
});


return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(){
  try{
    await connectToDatabase();
    const blogs=await Blog.find().sort({createdAt:-1});
    return NextResponse.json(blogs);
  }catch{
    return NextResponse.json({error:"Failed to fetch blogs"},{status:500});

  }
}

    
