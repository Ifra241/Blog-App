"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CommentDialog from "./Comment";

interface BlogCommentWrapperProps {
  blogId: string;
}

export default function BlogCommentWrapper({ blogId }: BlogCommentWrapperProps) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser) return null;
 return (
    <CommentDialog blogId={blogId} userId={currentUser._id} />
  );
}
