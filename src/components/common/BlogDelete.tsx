"use client";

import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deleteBlog } from "@/services/blogService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  blogId: string;
  authorId: string;
}

export default function DeleteButton({ blogId, authorId }: DeleteButtonProps) {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser || currentUser._id !== authorId) return null;

  async function handleDelete() {
    try {
      await deleteBlog(blogId);
      toast.success("Blog deleted successfully");
 router.push("/dashboard");
    } catch  {
      toast.error("Failed to delete blog");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-red-500"
          title="Delete Blog"
        >
          <FiTrash2 size={22} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Blog</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this blog?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
