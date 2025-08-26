"use client";

import { useState } from "react";
import Image from "next/image";
import {  Drawer,  DrawerContent,  DrawerHeader,  DrawerTitle,  DrawerDescription,  DrawerTrigger,} from "@/components/ui/drawer";
import Link from "next/link";

interface UserItem {
  _id: string;
  fullname: string;
  profilePic?: string;
}

interface UserListDrawerProps {
  title: string;
  description: string;
  users: UserItem[];
  count: number;
}

export function UserListDrawer({  title,  description,  users,  count,}: UserListDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className=" flex flex-col items-center text-sm font-semibold">
          <span>{title}</span>
              <span className="text-gray-500 text-xs">{count}</span>

        </button>
      </DrawerTrigger>

<DrawerContent className="fixed top-0 left-0 h-full w-full sm:w-80 md:w-96">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-gray-500">No {title.toLowerCase()} yet.</p>
          ) : (
          
          users.map((user) => (
  <Link
    key={user._id}
    href={`/profile/${user._id}`}
    className="flex items-center gap-3 border-b py-2"
  >
    {user.profilePic ? (
      <Image
        src={user.profilePic}
        alt={user.fullname || "User profile picture"}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
        {user.fullname?.[0]?.toUpperCase() || "?"}
      </div>
    )}
    <span className="font-medium">{user.fullname}</span>
  </Link>
))

          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
