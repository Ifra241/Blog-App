import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import mongoose, { Types } from "mongoose";
import { FaComment, FaEye,} from "react-icons/fa";
import Link from "next/link";
import Header from "@/components/common/Header";
import BlogLikeWrapper from "@/components/common/BlogLikeWrapper";
import BlogViews from "@/components/common/BlogViews";
import SaveBlogButton from "@/components/common/SaveButton";

interface BlogPageProps {
  params: { id: string };
}

 export interface PopulatedBlog {
  _id: string;
  title: string;
  content: string;
  image?: {
    public_id: string;
    folder: string;
    secure_url: string;
  };
  author?: {
    _id: string;
    fullname: string;
    profilePic?: string;
  } | null;
    likes?: string[];
    views:number;
savedBy?: Types.ObjectId[];

}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound();
  }

  try {
    await connectToDatabase();

    const blog = await Blog.findById(id)
      .populate("author", "fullname profilePic")
      .lean<PopulatedBlog>();


    if (!blog) return notFound();

    return (
      <div>
        {/* Header */}
        <Header />

          <div className="max-w-3xl mx-auto mt-6 p-4 space-y-6">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold">{blog.title}</h1>

        {/* Blog Image */}
        {blog.image?.secure_url ? (
          <div className="relative w-full h-64 md:h-96 rounded overflow-hidden">
            <Image
              src={blog.image.secure_url}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {/* Author + Icons */}
        <div className="flex items-center justify-between text-gray-500 text-sm">
          {/* Author */}
          <Link href={`/profile/${blog.author?._id}`}>
          <div className="flex items-center gap-2">
            {blog.author?.profilePic && (
              <Image
                src={blog.author.profilePic}
                alt={blog.author.fullname}
                width={30}
                height={30}
                className="rounded-full object-cover"
              />
            )}
            <span>By {blog.author?.fullname || "Unknown Author"}</span>
          </div>
          </Link>

          {/*  Icons */}
          <div className="flex items-center gap-4 text-gray-600">
            <BlogLikeWrapper blog={{_id:blog._id.toString(), likes:blog.likes?.map((id)=>id.toString())||[],
            


            }}/>
            <div className="flex items-center gap-1 cursor-pointer">
              <FaComment /> <span>12</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
                <FaEye size={22}/> <BlogViews blogId={blog._id.toString()} initialViews={blog.views || 0} />

            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <SaveBlogButton blogId={blog._id.toString()}
              savedBy={blog.savedBy?.map((id:Types.ObjectId)=>id.toString())||[]}/>
            </div>
          </div>
        </div>

        <hr />

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-full"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return (
      <div className="max-w-3xl mx-auto mt-6 p-4">
         <Header />
        <p className="text-red-500">Failed to load blog details.</p>
      </div>
    );
  }
}
