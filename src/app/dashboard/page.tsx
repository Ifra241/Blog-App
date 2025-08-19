"use client";

import Link from "next/link";
import useSWR from "swr";
import { formatBlogDate } from "@/utils/formatDate";
import Image from "next/image";
import { FiBell } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logoutUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { RiLogoutBoxFill } from "react-icons/ri";
import { Tooltip, TooltipContent,  TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import type { User as ReduxUser } from "@/store/userSlice";
import { toast } from "sonner";




const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
  createdAt: string;
}


export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const[user, setUser]=useState<ReduxUser|null>(null);

  const dispatch=useDispatch();
  const router=useRouter();
  const { data: blogs, error, isLoading } = useSWR<Blog[]>("/api/blogs", fetcher);
  //StoreUser
  useEffect(()=>{
    const storedUser=localStorage.getItem("user");
    if(storedUser) setUser(JSON.parse(storedUser)as ReduxUser);
    else if(currentUser) setUser(currentUser);
  },[currentUser])

  if (isLoading)
    return <p className="font-bold mt-28 ml-6 text-xl">Loading Blogs...</p>;
  if (error)
    return <p className="text-red-600 font-bold mt-28 ml-6 text-xl">
      Failed to load blogs
    </p>;
//handleclick
const handleClick=()=>{
  if(currentUser){
    router.push("/createblog");
  }else{
    toast.message("Need to login to create blog",{
      position:"top-center",

    })
    setTimeout(()=>{
          router.push("/signin");


    },1500);
  }
};
  //Logout
const handleLogout=()=>{
  if(!currentUser){
    alert("You are not logged in");
    return;
  }
  dispatch(logoutUser());
  router.push("/");
};
  return (
    <>
      <nav className="flex justify-between items-center px-4 py-6">
        <div>
          <div className="text-2xl font-bold mt-2 ml-1">📚Blogger</div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mt-2">
            Create a unique and beautiful blog
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
          onClick={handleClick}
            className="text-xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100"
          >
            📝 Write
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiBell size={28} color="darkblue"/>
          </button>
     </TooltipTrigger>
     <TooltipContent side="top" align="center">Notification</TooltipContent>
          </Tooltip>

          {/* Profile Link */}
          <Link href="/profile" className="flex items-center gap-2">
            {user?.profilePic ? (
              <Image
                src={user.profilePic}
                alt={user?.username||"User profile picture"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {user?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <span className="font-medium">{user?.username}</span>
          </Link>
          <Tooltip>
        <TooltipTrigger asChild>
              <button onClick={handleLogout} className= " hover:bg-gray-200"><RiLogoutBoxFill size={42}/></button>

            </TooltipTrigger>
        <TooltipContent side="top" align="center">
          Logout
        </TooltipContent >
      </Tooltip>
        </div>
      </nav>

      {/* Show blog */}
      {!isLoading && blogs?.length === 0 && <p>No Blogs found.</p>}

      <main className="max-w-7xl mx-auto p-8 mt-10 grid grid-cols-3 gap-8">
        {blogs?.map((blog) => (
          <div key={blog._id} className="max-w-md mx-auto flex flex-col ">
            {blog.image ? (
              <div className="w-full h-64 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={450}
                  height={250}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="mt-3 px-4 pb-4 flex flex-col flex-grow">
              <p className="text-sm text-gray-500 mb-1">{blog.author}</p>
              <p className="font-bold mb-2">{blog.title}</p>
              <p className="text-gray-800 line-clamp-2 flex-grow">
                {blog.content.slice(0, 100)}....
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatBlogDate(blog.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
