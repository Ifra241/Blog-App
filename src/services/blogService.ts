import { BlogProp } from "@/lib/models/Blog";
 

 export interface CreateBlogData{
    title:string;
    content:string;
    author:string;

 }

 export async function createBlog(data:CreateBlogData):Promise<BlogProp>{
    const res=await fetch("/api/blogs",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    if(!res.ok ){
         const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create blog");
  }

  return res.json();
  }

  export async function getBlog():Promise<BlogProp>{
    const res =await fetch("/api/blogs");
    if(!res.ok){
        const errorData=await res.json();
            throw new Error(errorData.error || "Failed to fetch blogs");

    }
    return res.json();
  }