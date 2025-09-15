"use client";

import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface EditButtonProps {
  blogId: string;
  authorId: string;
}

export default function EditButton({ blogId, authorId }: EditButtonProps) {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser || currentUser._id !== authorId) return null;

  function handleClick() {
router.push(`/createblog?blogId=${blogId}`);
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-gray-100"
      title="Edit Blog"
    >
      <FiEdit size={22} />
    </button>
  );
}
