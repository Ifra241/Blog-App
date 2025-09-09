"use client";

import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
    userId?: string;
}

interface Props {
  userId: string;
}

export default function NotificationBell({ userId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!userId) return;
    const res = await fetch(`/api/notifications/${userId}`);
    const data = await res.json();
    setNotifications(Array .isArray(data)?data:[]);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) fetchNotifications();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <FiBell size={28} color="darkblue" />
          {notifications.some(n => !n.read) && (
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500" />
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="p-4 w-[500px] max-h-96 overflow-y-auto">
        {/* Accessibility fix */}
        <DialogTitle className="text-lg font-bold mb-2">Notifications</DialogTitle>

        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(n => (
            <div
              key={n._id}
              className={`p-2 border-b ${n.read ? "" : "font-bold"}`}
            >
              {n.userId?(
                <Link href={`/profile/${n.userId}`} className="text-blue-600 hover:underline">
                </Link>
              ):(
                n.message
              )}
          
            </div>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
}
