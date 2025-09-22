"use client";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deleteBlog } from "@/services/blogService";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Loader from "./Loader";

interface DeleteButtonProps {
  blogId: string;
  authorId: string;
}

export default function DeleteButton({ blogId, authorId }: DeleteButtonProps) {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [loading, setLoading] = useState(false);

  if (!currentUser || currentUser._id !== authorId) return null;

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteBlog(blogId);
      toast.success("Blog deleted successfully");
      router.back(); 
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
     
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

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
    </>
  );
}
