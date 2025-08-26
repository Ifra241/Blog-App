"use client";

import { BlogProp } from "@/lib/models/Blog";
import { createBlog, CreateBlogData } from "@/services/blogService";
import React, { useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { FcAddImage } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loader2 } from "lucide-react"; 




export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  }

  function handleClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  const canPublish =
    title.trim() !== "" &&
    content.trim() !== "" &&
    currentUser &&
    image &&
    category.trim() !== "";

  async function handlePublish() {
    if (!currentUser) {
      setError("You need to login to publish a blog");
      return;
    }
    if (!canPublish) {
      setError("All fields including image and category are required!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data: CreateBlogData = {
        title,
        content,
        authorId: currentUser._id,
        image,
        category,
      };

      const newBlog: BlogProp = await createBlog(data);
      setSuccess(`Blog "${newBlog.title}" published successfully!`);
      setTitle("");
      setContent("");
      setImage(null);
      setCategory("");
    } catch (err) {
      setError((err as Error).message || "Failed to publish blog");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-10 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Bloger</h1>
        <div className="flex items-center gap-2">
          <button
            disabled={!canPublish || loading}
            onClick={handlePublish}
            className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
              canPublish
                ? "bg-green-400 text-white hover:bg-green-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 className="animate-spin w-5 h-5" />}
            {loading ? "Publishing..." : "Publish"}
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiBell size={28} color="darkblue" />
          </button>
        </div>
      </div>

      {/* Title */}
      <textarea
        placeholder="Title"
        value={title}
        rows={2}
        onChange={(e) => setTitle(e.target.value)}
        className="text-3xl sm:text-5xl font-serif font-semibold placeholder-gray-300 focus:outline-none border-b-2 border-gray-300 pb-2 resize-none w-full"
      />

      {/* Image Upload + Category Inline */}
      <div className="flex items-center gap-4 mt-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImage}
          accept="image/*"
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2"
        >
          <FcAddImage size={36} />
        </button>

        {/* Category dropdown inline */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-transparent text-gray-700 focus:outline-none"
        >
          <option value="">Select category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
        </select>
      </div>

      {/* Selected image filename */}
      {image && (
        <p className="mt-2 text-gray-600 text-sm">Selected image: {image.name}</p>
      )}

      {/* Content */}
       <textarea placeholder="Tell your story..." 
       value={content} onChange={(e) => setContent(e.target.value)}
       className="w-full min-h-[300px] sm:min-h-[400px] resize-none text-lg leading-relaxed placeholder-gray-300 focus:outline-none mt-4" />


      {/* Messages */}
      {error && <p className="text-red-500 font-semibold">{error}</p>}
      {success && <p className="text-green-400 font-semibold">{success}</p>}
    </div>
  );
}
