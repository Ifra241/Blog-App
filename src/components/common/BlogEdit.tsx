"use client";

import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import Loader from "./Loader";

interface EditButtonProps {
  blogId: string;
  authorId: string;
}

export default function EditButton({ blogId, authorId }: EditButtonProps) {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [loading, setLoading] = useState(false);

  if (!currentUser || currentUser._id !== authorId) return null;

  function handleClick() {
    setLoading(true);
    router.push(`/createblog?blogId=${blogId}`);
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Edit Blog"
      >
        <FiEdit size={22} />
      </button>
    </>
  );
}
