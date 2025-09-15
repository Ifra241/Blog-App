"use client";

import { BlogProp } from "@/lib/models/Blog";
import { createBlog, CreateBlogData, updateBlog, getBlogById } from "@/services/blogService";
import React, { useRef, useState, useEffect } from "react";
import { FcAddImage } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Blog } from "@/utils/Types";

interface ImageData {
  public_id: string;
  folder: string;
  secure_url: string;
}

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [image, setImage] = useState<File | ImageData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blogId");

  // Prefill blog data when editing
  useEffect(() => {
    async function fetchBlog() {
      if (blogId) {
        try {
          const blog: BlogProp = await getBlogById(blogId);
          setTitle(blog.title);
          setContent(blog.content);
          setCategory(blog.category);
          setImage(blog.image || null);
        } catch {
          toast.error("Failed to fetch blog");
        }
      }
    }
    fetchBlog();
  }, [blogId]);

  const canPublish =
    title.trim() !== "" &&
    content.trim() !== "" &&
    currentUser &&
    category.trim() !== "" &&
    (blogId ? true : image);

  const handleClick = () => fileInputRef.current?.click();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handlePublish = async () => {
    if (!currentUser) return toast.message("You need to login");
    if (!canPublish) return toast.message("All fields are required!");

    setLoading(true);
    setSuccess(null);

    try {
      let finalImage: ImageData | undefined = undefined;
      let oldPublicId: string | undefined = undefined;

      // If editing and existing image
      if (blogId && image && !(image instanceof File)) {
        finalImage = image;
        oldPublicId = image.public_id;
      }

      // If new image uploaded
      if (image instanceof File) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("type", "blog");

        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.error || "Image upload failed");

        finalImage = {
          public_id: uploadResult.public_id,
          folder: uploadResult.folder || "blog/images",
          secure_url: uploadResult.secure_url,
        };
      }

      if (blogId) {
        // Update blog
        const updatedBlog: Blog = await updateBlog(blogId, {
          title,
          content,
          category,
          ...(finalImage ? { image: finalImage } : {}),
          ...(oldPublicId ? { oldPublicId } : {}),
        });
        setSuccess(`Blog "${updatedBlog.title}" updated successfully!`);
      } else {
        // Create blog
        if (!finalImage) throw new Error("Image is required for new blog");
        const data: CreateBlogData = {
          title,
          content,
          authorId: currentUser._id,
          image: image as File,
          category,
        };
        const newBlog: BlogProp = await createBlog(data);
        setSuccess(`Blog "${newBlog.title}" published successfully!`);
      }

      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
    } catch (err) {
      toast.error((err as Error).message || "Failed to publish blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-10 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{blogId ? "Edit Blog" : "Create Blog"}</h1>
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
            {loading ? (blogId ? "Updating..." : "Publishing...") : blogId ? "Update" : "Publish"}
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

      {/* Image Upload + Category */}
      <div className="flex items-center gap-4 mt-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImage}
          accept="image/*"
          style={{ display: "none" }}
        />
        <button type="button" onClick={handleClick} className="flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2">
          <FcAddImage size={36} />
        </button>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent text-gray-700 focus:outline-none">
          <option value="">Select category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
        </select>
      </div>

      {image && image instanceof File && <p className="mt-2 text-gray-600 text-sm">Selected image: {image.name}</p>}

      {/* Content */}
      <textarea
        placeholder="Tell your story..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[300px] sm:min-h-[400px] resize-none text-lg leading-relaxed placeholder-gray-300 focus:outline-none mt-4"
      />

      {/* Preview Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 rounded-full font-semibold flex items-center gap-2 bg-green-400 text-white hover:bg-green-500"
        >
          Preview
        </button>
      </div>

      {success && <p className="text-green-400 font-semibold">{success}</p>}

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-8xl w-full mx-4 p-6 space-y-6 max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center">{title}</DialogTitle>
          </DialogHeader>

          {category && <p className="text-gray-600 text-lg text-center">Category: {category}</p>}

          {image && (
            <div className="w-full max-w-md mx-auto relative h-96">
              <Image
                src={image instanceof File ? URL.createObjectURL(image) : image.secure_url}
                alt="Preview"
                fill
                style={{ objectFit: "cover", borderRadius: "0.5rem" }}
              />
            </div>
          )}

          {content && (
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap text-center">{content}</p>
          )}

          <DialogFooter className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-8 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Edit
            </button>
            <button
              onClick={handlePublish}
              disabled={!canPublish || loading}
              className={`px-4 py-2 rounded-full font-semibold ${
                canPublish
                  ? "bg-green-400 text-white hover:bg-green-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (blogId ? "Updating..." : "Publishing...") : blogId ? "Update" : "Publish"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
