/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/notifications/${userId}`);
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  // Open/close dialog
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) fetchNotifications(); // refresh when opened
  };

  // Mark notification as read on click
  const handleNotificationClick = async (n: Notification) => {
    if (!n.read) {
      try {
        await fetch("/api/notifications/read", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: n._id }),
        });

        setNotifications(prev =>
          prev.map(notif =>
            notif._id === n._id ? { ...notif, read: true } : notif
          )
        );
      } catch (err) {
        console.error("Failed to mark notification read:", err);
      }
    }

  
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <FiBell size={28} color="darkblue" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500" />
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="p-4 w-[500px] max-h-96 overflow-y-auto">
        <DialogTitle className="text-lg font-bold mb-2">Notifications</DialogTitle>

        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(n => (
            <div
              key={n._id}
              className={`p-2 border-b cursor-pointer ${n.read ? "" : "font-bold"}`}
              onClick={() => handleNotificationClick(n)}
            >
                {n.message}
           
            </div>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
}
