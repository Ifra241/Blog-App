"use client"; 
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { useComments, addComment, deleteComment, editComment } from "@/services/commentService";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/utils/formatDate";
import { FaRegComment } from "react-icons/fa";

interface CommentDialogProps {
  blogId: string;
  userId: string;
  currentUserFullname?: string;
  currentUserProfilePic?: string;
}

interface CommentType {
  _id: string;
  content: string;
  user: {
    fullname: string;
    _id: string;
    profilePic?: string;
  };
  createdAt: string;
}

export default function CommentDialog({
  blogId,
  userId,
  currentUserFullname,
  currentUserProfilePic,
}: CommentDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { comments, isLoading, isError, mutate } = useComments(blogId);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    if (editingCommentId) {
      // Editing existing comment
      await editComment(editingCommentId, inputValue);
      mutate();
      setEditingCommentId(null);
    } else {
      // Adding new comment
      const tempComment: CommentType = {
        _id: Date.now().toString(),
        content: inputValue,
        createdAt: new Date().toISOString(),
        user: {
          _id: userId,
          fullname: currentUserFullname || "You",
          profilePic: currentUserProfilePic,
        },
      };
      mutate((prev: CommentType[] = []) => [...prev, tempComment], false);
      const posted = await addComment(blogId, userId, inputValue);
      if (posted) mutate();
    }

    setInputValue("");
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
    mutate((prev: CommentType[] = []) => prev.filter((c) => c._id !== commentId), false);
  };

  const handleEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setInputValue(content);
    setActiveDropdown(null);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <FaRegComment  size={24} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{comments?.length || 0}</span>
        </div>
      </DrawerTrigger>

      <DrawerContent className="fixed top-16 right-4 h-[80vh] w-96 lg:w-[420px] p-6 bg-gray-100 dark:bg-gray-800 shadow-xl flex flex-col border-l border-gray-300 dark:border-gray-700 rounded-l-md">
        <DrawerHeader className="border-b border-gray-300 dark:border-gray-700 pb-2 mb-4">
          <DrawerTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Comments
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {isLoading && <p className="text-gray-500">Loading comments...</p>}
          {isError && <p className="text-red-500">Failed to load comments.</p>}
          {!isLoading && comments?.length === 0 && <p className="text-gray-500">No comments yet.</p>}

          {comments?.map((c: CommentType) => (
            <div key={c._id} className="flex flex-col relative">
              <div className="flex items-center justify-between gap-3 py-1">
                <Link href={`/profile/${c.user._id}`} className="flex items-center gap-3">
                  {c.user.profilePic ? (
                    <Image
                      src={c.user.profilePic}
                      alt={c.user.fullname || "User profile picture"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {c.user.fullname?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {c.user?.fullname || "Unknown"}
                  </span>
                </Link>

                {c.user._id === userId && (
                  <div className="relative">
                    <button
                      className="p-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setActiveDropdown(activeDropdown === c._id ? null : c._id)}
                    >
                      <FaEllipsisV />
                    </button>
                    {activeDropdown === c._id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-700 shadow-lg rounded-md flex flex-col z-10">
                        <button
                          onClick={() => handleEdit(c._id, c.content)}
                          className="flex items-center gap-2 px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="flex items-center gap-2 px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className="dark:text-gray-200 mt-1">{c.content}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatBlogDate(c.createdAt)}
              </span>

              <hr className="my-2 border-gray-300 dark:border-gray-600" />
            </div>
          ))}

          <div ref={commentsEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            onClick={handleSend}
            className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            {editingCommentId ? "Send" : "Send"}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
