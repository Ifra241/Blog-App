"use client";

import { saveBlog } from "@/services/blogService";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { updateSavedBlogs } from "@/store/userSlice";

interface SaveBlogButtonProps {
  blogId: string;
  savedBy?:string[];
}

export default function SaveBlogButton({ blogId }: SaveBlogButtonProps) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState<boolean | null>(null); 

  useEffect(() => {
    if (!currentUser) return;
    const savedBlogIds = currentUser.savedBlogs?.map(id => id.toString()) || [];
    setIsSaved(savedBlogIds.includes(blogId));
  }, [currentUser, blogId]);

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const updatedSavedBlogs = await saveBlog(currentUser._id, blogId);
      if (!updatedSavedBlogs) return;

      setIsSaved(updatedSavedBlogs.map(id => id.toString()).includes(blogId));

      // update Redux store
      dispatch(updateSavedBlogs(updatedSavedBlogs));
    } catch (err) {
      console.error("Error saving/unsaving blog:", err);
    }
  };

  if (isSaved === null) return null;

  return (
    <div onClick={handleSave} style={{ cursor: "pointer" }}>
      {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={22}  title="Save Blog"/>}
    </div>
  );
}
