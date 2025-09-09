"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import LikeButton from "./LikeButton";

interface BlogProps {
  blog: {
    _id: string;
    likes?: string[];
  };
}

export default function BlogLikeWrapper({ blog }: BlogProps) {
  // Redux se current user lo
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser) return null; 
  return (
    <LikeButton
      blogId={blog._id}
      currentUserId={currentUser._id} 
       currentUserName={currentUser.fullname}
      initialLikes={blog.likes?.length || 0}
      userHasLiked={blog.likes?.includes(currentUser._id) || false}
    />
  );
}
