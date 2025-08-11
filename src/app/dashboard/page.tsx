"use client";

import Link from "next/link";
import useSWR from "swr";
import { formatBlogDate } from "@/utils/formatDate";
import Image from "next/image";




const fetcher=(url:string)=>fetch(url).then(res=>res.json());

interface Blog{
    _id:string;
    title:string;
    content:string;
    author:string;
    image?:string;
    createdAt:string;
}


export default function Dashboard() {

    const{data:blogs,error,isLoading}= useSWR<Blog[]>("/api/blogs",fetcher);
    if(isLoading)return<p>Loading Blogs...</p>
      if (error) return <p className="text-red-600">Failed to load blogs</p>;


    return(
        <>
       
        <nav className="flex justify-between items-center px-4 py-6">
            <div>
            <div className="text-2xl font-bold mt-2 ml-1">📚Blogger</div>
            </div>
            <div>
                <h1 className="text-2xl font-bold mt-2">Create a unique and beautiful blog</h1>
            </div>
            <div>
                <Link href="/createblog"className="text-xl font-semibold px-10  ">📝Write</Link>
            </div>
            </nav>

            {/* Show blog*/}
        {!isLoading&&blogs?.length===0&&<p>No Blogs found.</p>}


<main className="max-w-7xl mx-auto p-8 mt-10 grid grid-cols-3 gap-8">

     {blogs?.map((blog)=>(
        <div key={blog._id}
        className="max-w-md mx-auto flex flex-col overflow-hidden">
            {blog.image?(
                <Image src={blog.image} alt={blog.title}   width={400} height={250}className="w-full object-cover"  />


            ):(
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
      No Image
    </div>
                
            )}
            <div className="mt-3">
                <p className="text-sm text-gray-500 mb-1">{blog.author}</p>
                 <p className="font-bold mb-2">{blog.title}</p>
              <p className="text-gray-800 line-clamp-2">{blog.content.split("\n")[0].slice(0,150)}....</p>
              <p className="text-xs text-gray-500 mt-1">{formatBlogDate(blog.createdAt)}</p>



            </div>

        </div>

))}          

        </main>

        </>

    )

}
