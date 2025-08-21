"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaUserEdit } from "react-icons/fa";
import { SlUserFollow } from "react-icons/sl";
import { Blog, User } from "@/services/profileService";
import { useState, useEffect } from "react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfilePage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userId = currentUser?._id;

  const { data: user, error: userError } = useSWR<User>(
    userId ? `/api/user/${userId}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const { data: blogs, error: blogsError } = useSWR<Blog[]>(
    userId ? `/api/user/${userId}/blogs` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  // Hydration-safe state
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // prevent SSR mismatch

  if (!userId) return <p className="mt-20 text-center text-gray-600">Please login to view profile</p>;
  if (userError || blogsError) return <p className="mt-20 text-center text-red-500">Error loading profile</p>;
  if (!user || !blogs) return <p className="mt-20 text-center text-gray-600">Loading...</p>;

  const followersCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;
  const blogsCount = blogs?.length || 0;

  return (
    <div className="flex flex-col items-center mt-16 px-4 sm:px-6 md:px-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center w-full max-w-5xl bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex flex-col md:flex-row w-full md:items-start justify-center md:justify-between gap-6 md:gap-16">
          {/* Profile Picture & Name */}
          <div className="flex flex-col items-center md:items-start">
            {user.profilePic || user.fullname ? (
              <Image
                src={user.profilePic ?? "/profile-placeholder.png"}
                alt={user.fullname ?? "User profile picture"}
                width={120}
                height={120}
                className="rounded-full"
              />
            ) : null}
            <h1 className="mt-2 text-2xl font-bold text-center md:text-left">
              {user.fullname ?? "Unknown User"}
            </h1>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center md:items-start gap-4 md:gap-4">
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-gray-500 text-sm">Followers</span>
                <span className="font-semibold text-lg">{followersCount}</span>
              </div>
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-gray-500 text-sm">Following</span>
                <span className="font-semibold text-lg">{followingCount}</span>
              </div>
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-gray-500 text-sm">Posts</span>
                <span className="font-semibold text-lg">{blogsCount}</span>
              </div>
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-gray-500 text-sm">Views</span>
                <span className="font-semibold text-lg">{blogsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 justify-center md:justify-start">
          <Button variant="outline" className="flex items-center gap-2">
            <FaUserEdit /> Edit Profile
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <SlUserFollow /> Follow
          </Button>
        </div>
      </div>

      {/* Blog Section */}
      <div className="mt-12 w-full max-w-5xl flex flex-col gap-6">
        {blogsCount === 0 ? (
          <p className="text-gray-500 text-center">No blogs yet</p>
        ) : (
          blogs.map((blog) => (
            <Card key={blog._id} className="overflow-hidden flex flex-col sm:flex-row gap-4 sm:gap-6">
              <CardContent className="flex-1 p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-1">{blog.title}</h2>
                <p className="text-gray-600 mb-2">{blog.content.slice(0, 100)}...</p>
              </CardContent>

              {/* Blog Image */}
              <div className="w-full sm:w-48 h-48 sm:h-32 relative rounded overflow-hidden">
                {blog.image?.secure_url ? (
                  <Image
                    src={blog.image.secure_url}
                    alt={blog.title ?? "Blog image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="/blog-placeholder.jpg"
                    alt="Blog placeholder"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
