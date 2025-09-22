"use client";
import Link from "next/link";
import useSWR from "swr";
import { formatBlogDate } from "@/utils/formatDate";
import Image from "next/image";
import {  FaEye, FaHeart } from "react-icons/fa";
import { useState } from "react";
import Header from "@/components/common/Header";
import Loader from "@/components/common/Loader";


const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  image?: {
    public_id: string;
    folder: string;
    secure_url: string;
  };
  createdAt: string;
  author?: {
    _id: string;
    fullname?: string;
    profilePic?: string;
  } | null;
  likes?:string[];
  views:number;
}

const categories = ["All", "Technology", "Lifestyle", "Education", "Health"];


export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState(""); 


  
  const { data: blogs, error, isLoading } = useSWR<Blog[]>("/api/blogs", fetcher);

  
  if (isLoading)
    return <span className="flex items-center justify-center h-screen"> <Loader /></span>;
  if (error)
    return (
      <p className="text-red-600 font-bold mt-28 ml-6 text-xl">
        Failed to load blogs
      </p>
    );

//Filterd Blog
  let filteredBlogs = blogs?.filter(blog =>
    selectedCategory === "All" ? true : blog.category === selectedCategory
  );
  // Filter blogs by search query
if (searchQuery.trim() !== "") {
  filteredBlogs = filteredBlogs?.filter(blog =>
    (blog.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
}




  return (
    <>
      {/* header */}

      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />


      {/* Centered Category Navbar */}
      <div className="flex justify-center gap-4 overflow-x-auto px-4 py-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap border ${
              selectedCategory === cat
                ? "bg-gray-300 text-gray-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {!isLoading && filteredBlogs?.length === 0 && (
        <p className="text-center text-gray-500 font-semibold mt-10">
          No Blogs found.
        </p>
      )}

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredBlogs?.map((blog) => (
          <Link key={blog._id} href={`/dashboard/blog/${blog._id}`}>
            <div className="relative flex flex-col max-w-md mx-auto hover:shadow-lg transition-shadow duration-200 rounded-lg">
              
             

              {blog.image?.secure_url ? (
                <div className="relative w-full h-56 md:h-72 lg:h-80">
                  <Image
                    src={blog.image.secure_url}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-56 md:h-72 lg:h-80 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="mt-3 px-4 pb-4 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  {blog.author?.profilePic ? (
                    <Image
                      src={blog.author.profilePic}
                      alt={blog.author.fullname ?? "User"}
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {blog.author?.fullname? blog.author.fullname[0].toLocaleUpperCase():"?"}
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    {blog.author?.fullname ?? "Unknown Author"}
                  </span>
                </div>

                <p className="font-bold mb-2">{blog.title}</p>
                <p className="text-gray-800 line-clamp-2 flex-grow">
                  {blog.content.slice(0, 100)}....
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatBlogDate(blog.createdAt)}
                </p>

                {/* Comment, Views & Likes */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-gray-500">
                   <FaHeart /> <span>{blog.likes?.length || 0}</span>


                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                                 <FaEye/><span>{blog.views || 0}</span>
                 
                  </div>
                  
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </>
  );
}
