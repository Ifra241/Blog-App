import cloudinary from "@/lib/cloudinary";
import Blog from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,{params}:{params:{blogId:string}}){
    try{
        await connectToDatabase();
          const blogId  = params.blogId; 

         const blog=await Blog.findById(blogId).populate("author",
      "fullname profilePic");
     if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch blog",error },
      { status: 500 }
    );
    }

}


//Edit Blog

export async function PUT(
  req: NextRequest,
  { params }: { params:{ blogId: string } } 
) {
  const  blogId  =  params.blogId; 
  const { title, content, image, category, oldPublicId } = await req.json();

  if (image && oldPublicId) {
    try {
      await cloudinary.uploader.destroy(oldPublicId);
    } catch (err) {
      console.error("Cloudinary delete failed:", err);
    }
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    { title, content, category, ...(image ? { image } : {}) },
    { new: true }
  );

  if (!updatedBlog)
    return NextResponse.json({ message: "Blog Not found" }, { status: 404 });

  return NextResponse.json(updatedBlog, { status: 200 });
}

//Delete Blog


export  async function DELETE(req:NextRequest,{params}:{params:{blogId:string}}){

  try{
    await connectToDatabase();

    const{blogId}=params;

    const blog=await Blog.findById(blogId);
    if(!blog)return NextResponse.json({message:"Blog Not Found"},{status:404});
    if(blog.image?.public_id){
      await cloudinary.uploader.destroy(blog.image.public_id);
    }
    await blog.deleteOne();
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong",err }, { status: 500 });
  }
}
