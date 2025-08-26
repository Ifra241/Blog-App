"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaUserEdit } from "react-icons/fa";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { Blog, User } from "@/utils/Types";
import Link from "next/link";
import { toggleFollow } from "@/services/followService";
import { use } from "react";
import { UserListDrawer } from "@/components/common/FollowersDrawer";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type UserItem = { _id: string; fullname: string; profilePic?: string };

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const profileId = id;

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // SWR for profile user data
  const { data: user, error: userError } = useSWR<User>(
    profileId ? `/api/user/${profileId}` : null,
    fetcher
  );

  // SWR for user's blogs
  const { data: blogs, error: blogsError } = useSWR<Blog[]>(
    profileId ? `/api/user/${profileId}/blogs` : null,
    fetcher
  );

  if (!profileId) return <p className="mt-20 text-center text-gray-600">Please login to view profile</p>;
  if (userError || blogsError) return <p className="mt-20 text-center text-red-500">Error loading profile</p>;
  if (!user || !blogs) return <p className="mt-20 text-center text-gray-600">Loading...</p>;

  // Convert followers/following to proper objects for Drawer
  type Follower = string | { _id: string; fullname?: string; profilePic?: string };
  const followersList: UserItem[] = (user.followers as Follower[] ?? []).map(f =>
    typeof f === "string"
      ? { _id: f, fullname: "Unknown User" }
      : { _id: f._id, fullname: f.fullname ?? "Unknown User", profilePic: f.profilePic }
  );

  const followingList: UserItem[] = (user.following as Follower[] ?? []).map(f =>
    typeof f === "string"
      ? { _id: f, fullname: "Unknown User" }
      : { _id: f._id, fullname: f.fullname ?? "Unknown User", profilePic: f.profilePic }
  );

  const isFollowing = (user.followers as Follower[] ?? []).some(f => {
    if (typeof f === "string") return f === currentUser?._id;
    return f._id === currentUser?._id;
  });

  // Handle follow/unfollow click
  const handleFollowToggle = async () => {
    if (!currentUser) return;
    const action = isFollowing ? "unfollow" : "follow";

    try {
      await toggleFollow({
        targetUserId: profileId,
        currentUserId: currentUser._id,
        action,
      });

      // Revalidate SWR cache
      mutate(`/api/user/${profileId}`);
      mutate(`/api/user/${profileId}/blogs`);
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const followersCount = followersList.length;
  const followingCount = followingList.length;
  const blogsCount = blogs?.length || 0;

  return (
    <div className="flex flex-col items-center mt-16 px-4 sm:px-6 md:px-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center w-full max-w-5xl bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex flex-col md:flex-row w-full md:items-start justify-center md:justify-between gap-6 md:gap-16">
          {/* Profile Picture & Name */}
          <div className="flex flex-col items-center md:items-start">
            {user.profilePic && user.profilePic.trim() !== "" ? (
              <Image
                src={user.profilePic}
                alt={user.fullname ?? "User profile picture"}
                width={120}
                height={120}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-3xl">
                {user.fullname[0].toUpperCase()}
              </div>
            )}
            <h1 className="mt-2 text-2xl font-bold text-center md:text-left">
              {user.fullname ?? "Unknown User"}
            </h1>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center md:items-start gap-4 md:gap-4">
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              {/* Followers Drawer Trigger */}
              <UserListDrawer
                title="Followers"
                description="List of users following this profile"
                users={followersList}
                count={followersCount}
              />

              {/* Following Drawer Trigger */}
              <UserListDrawer
                title="Following"
                description="List of users this profile is following"
                users={followingList}
                count={followingCount}
              />

              {/* Posts count */}
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-sm font-semibold">Posts</span>
                <span className="text-gray-500 text-xs">{blogsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 justify-center md:justify-start">
          {currentUser?._id === user._id ? (
            <Button variant="outline" className="flex items-center gap-2">
              <FaUserEdit /> Edit Profile
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleFollowToggle}
            >
              {isFollowing ? (
                <><SlUserFollowing /> Following</>
              ) : (
                <><SlUserFollow /> Follow</>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Blog Section */}
      <div className="mt-12 w-full max-w-5xl flex flex-col gap-6">
        {blogsCount === 0 ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            <p className="text-gray-500 text-center">No blogs yet</p>
            {currentUser?._id === user._id && (
              <Link href="/createblog">
                <button className="text-xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100">
                  Create Blog
                </button>
              </Link>
            )}
          </div>
        ) : (
          blogs.map(blog => (
            <Link key={blog._id} href={`/dashboard/blog/${blog._id}`}>
              <Card className="overflow-hidden flex flex-col sm:flex-row gap-4 sm:gap-6">
                <CardContent className="flex-1 p-4 sm:p-6">
                  <h2 className="text-2xl font-semibold mb-1">{blog.title}</h2>
                  <p className="text-gray-600 mb-2">{blog.content.slice(0, 100)}...</p>
                </CardContent>
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
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
