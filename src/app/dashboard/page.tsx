"use client";

import Link from "next/link";
import useSWR from "swr";
import { formatBlogDate } from "@/utils/formatDate";
import Image from "next/image";
import { FiBell, FiMessageCircle, FiEye, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logoutUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { RiLogoutBoxFill } from "react-icons/ri";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import type { User as ReduxUser } from "@/store/userSlice";
import { toast } from "sonner";

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
}

const categories = ["All", "Technology", "Lifestyle", "Education", "Health"];

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [user, setUser] = useState<ReduxUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const dispatch = useDispatch();
  const router = useRouter();
  const { data: blogs, error, isLoading } = useSWR<Blog[]>("/api/blogs", fetcher);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser) as ReduxUser);
    else if (currentUser) setUser(currentUser);
  }, [currentUser]);

  if (isLoading)
    return <p className="font-bold mt-28 ml-6 text-xl">Loading Blogs...</p>;
  if (error)
    return (
      <p className="text-red-600 font-bold mt-28 ml-6 text-xl">
        Failed to load blogs
      </p>
    );

  const handleClick = () => {
    if (currentUser) router.push("/createblog");
    else {
      toast.message("Need to login to create blog", { position: "top-center" });
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    }
  };

  const handleLogout = () => {
    if (!currentUser) {
      alert("You are not logged in");
      return;
    }
    dispatch(logoutUser());
    router.push("/");
  };

  const filteredBlogs = blogs?.filter(blog =>
    selectedCategory === "All" ? true : blog.category === selectedCategory
  );

  return (
    <>
      {/* Top Navbar */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 py-6 gap-4 md:gap-0">
        <div>
          <div className="text-2xl font-bold mt-2 ml-1">📚Blogger</div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mt-2 text-center md:text-left">
            Create a unique and beautiful blog
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleClick}
            className="text-xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100"
          >
            📝 Write
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FiBell size={28} color="darkblue" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Notification
            </TooltipContent>
          </Tooltip>

          <Link href="/profile" className="flex items-center gap-2">
            {user?.profilePic ? (
              <Image
                src={user.profilePic}
                alt={user?.username || "User profile picture"}
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
              <button onClick={handleLogout} className="hover:bg-gray-200">
                <RiLogoutBoxFill size={42} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Logout
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>

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
                      ?
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
                    <FiMessageCircle /> <span>12</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <FiEye /> <span>34</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <FiHeart /> <span>56</span>
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
