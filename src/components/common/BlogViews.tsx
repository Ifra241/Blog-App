"use client"
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface Props {
  blogId: string;
  initialViews: number;
}

export default function BlogViews({ blogId, initialViews }: Props) {
  const [views, setViews] = useState(initialViews);
  const hasIncremented = useRef(false); 

  useEffect(() => {
    if (hasIncremented.current) return; // agar pehle hi increment ho gaya hai, skip
    hasIncremented.current = true;

    const viewedBlogs = JSON.parse(sessionStorage.getItem("viewedBlogs") || "[]");
    if (!viewedBlogs.includes(blogId)) {
      axios.post(`/api/blogs/${blogId}/increment-view`)
        .then(res => setViews(res.data.views))
        .catch(err => console.error(err));

      // mark in session storage
      sessionStorage.setItem("viewedBlogs", JSON.stringify([...viewedBlogs, blogId]));
    }
  }, [blogId]);
  console.log("incrementing view for blogId:", blogId);




  return <span>{views}</span>;
}
