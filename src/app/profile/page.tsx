"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaUserEdit } from "react-icons/fa";
import { SlUserFollow } from "react-icons/sl";
import { Blog, User } from "@/services/profileService";

interface ProfilePageProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfilePage({ userId }: ProfilePageProps) {
  // Fetch user info
  const { data: user, error: userError } = useSWR<User>(
    `/api/user/${userId}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  // Fetch user's blogs
  const { data: blogs, error: blogsError } = useSWR<Blog[]>(
    `/api/user/${userId}/blogs`,
    fetcher,
    { refreshInterval: 5000 }
  );

  if (userError || blogsError) return <p>Error loading profile</p>;
  if (!user || !blogs) return <p>Loading profile...</p>;

  return (
    <div className="flex flex-col items-center mt-16 px-4">
      {/* Header */}
      <div className="flex flex-col items-center w-full max-w-4xl bg-white rounded-xl shadow-md p-6 sm:p-8">
        {/* Profile & Stats Row */}
        <div className="flex flex-col md:flex-row w-full md:items-start justify-center md:justify-between gap-6 md:gap-16">
          {/* Profile img + name */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src={user.profilePic || "/profile-placeholder.png"}
              alt={user.username}
              width={120}
              height={120}
              className="rounded-full"
            />
            <h1 className="mt-2 text-2xl font-bold text-center md:text-left">{user.username}</h1>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center md:items-start gap-4 md:gap-4">
            <div className="flex gap-6">
              <div className="flex flex-col items-center md:items-start gap-2">
                <span className="text-gray-500">Followers</span>
                <span className="font-semibold text-lg">{user?.followers?.length || 0}</span>
              </div>
              <div className="flex flex-col items-center md:items-start gap-2">
                <span className="text-gray-500">Following</span>
                <span className="font-semibold text-lg">{user?.following?.length || 0}</span>
              </div>
              <div className="flex flex-col items-center md:items-start gap-2">
                <span className="text-gray-500">Posts</span>
                <span className="font-semibold text-lg">{blogs?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button variant="outline"><FaUserEdit /> Edit Profile</Button>
          <Button variant="outline"><SlUserFollow /> Follow</Button>
        </div>
      </div>

      {/* Blog Section */}
      <div className="mt-12 w-full max-w-4xl flex flex-col gap-6">
        {blogs?.map(blog => (
          <Card key={blog._id} className="overflow-hidden flex flex-col sm:flex-row">
            <CardContent className="flex-1 p-6">
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600">{blog.description}</p>
            </CardContent>
            <div className="w-full sm:w-48 h-48 sm:h-32 relative">
              <Image
                src={blog.image || "/blog-placeholder.jpg"}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
