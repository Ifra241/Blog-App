"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { Blog, User } from "@/utils/Types";
import Link from "next/link";
import { toggleFollow } from "@/services/followService";
import { use, useEffect, useState } from "react";
import { UserListDrawer } from "@/components/common/FollowersDrawer";
import Header from "@/components/common/Header";
import { EditProfileDialog } from "@/components/common/EditProfile";
import { FaUserEdit } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import ViewsChart from "@/components/common/ViewGraph";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type UserItem = { _id: string; fullname: string; profilePic?: string };

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const profileId = id;
const [openDialog, setOpenDialog] = useState(false);
const [showViewsChart, setShowViewsChart] = useState(false);


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
//SWR For total Views

const{data:viewsData}=useSWR(profileId? `/api/blogs/author-view/${profileId}` :null, fetcher);
const totalViews = viewsData?.totalViews || 0;
  // State for tabs
  const [activeFilter, setActiveFilter] = useState<"blog" | "savedBlog">("blog");
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]); 

  
  // SWR for user's saved blogs (only fetch when tab is active)
const { data: savedBlogsData} = useSWR<Blog[]>(
  activeFilter === "savedBlog" && profileId ? `/api/blogs/savedBlogs?userId=${profileId}` : null,
  fetcher
);

// Update state when data is fetched
useEffect(() => {
  if (savedBlogsData) {
    setSavedBlogs(savedBlogsData);
  }
}, [savedBlogsData]);


  if (!profileId) return <p className="mt-20 text-center text-gray-600">Please login to view profile</p>;
  if (userError || blogsError) return <p className="mt-20 text-center text-red-500">Error loading profile</p>;
  if (!user || !blogs) return <div className="flex items-center justify-center h-screen"><Loader/></div>;

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
            currentUserName: currentUser.fullname,
            authorId: profileId,
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
    <>
    <Header/>
    <div className="flex flex-col items-center mt-16 px-4 sm:px-6 md:px-8">
      {/* Profile Header */}
     <div className="flex flex-col items-center w-full max-w-5xl bg-white rounded-xl shadow-md p-6 sm:p-8">
  <div className="flex flex-col md:flex-row w-full md:items-start justify-between">
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
          {user?.fullname?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      <h1 className="mt-2 text-2xl font-bold text-center md:text-left">
        {user.fullname ?? "Unknown User"}
      </h1>
      <p className="text-center md:text-left text-gray-600 max-w-[250px]">{user.bio}</p>
    </div>

    {/* Stats */}
    <div className="flex flex-col items-center md:items-start">
      <div className="flex gap-8 flex-wrap justify-center md:justify-start">
        {/* Followers */}
        <UserListDrawer
          title="Followers"
          description="List of users following this profile"
          users={followersList}
          count={followersCount}
        />

        {/* Following */}
        <UserListDrawer
          title="Following"
          description="List of users this profile is following"
          users={followingList}
          count={followingCount}
        />

        {/* Posts */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold">Posts</span>
          <span className="text-gray-600 text-xs">{blogsCount}</span>
        </div>

        {/* Views */}
        <div className="flex flex-col items-center gap-1" onClick={()=>setShowViewsChart(prev=>!prev)}>
          <span className="text-sm font-semibold cursor-pointer">Views</span>
          <span className="text-gray-600 text-xs">{totalViews}</span>
        </div>
      </div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 justify-center md:justify-start">
    {currentUser?._id === user._id ? (
      <>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setOpenDialog(true)}
        >
          <FaUserEdit /> Edit Profile
        </Button>

        <EditProfileDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          user={user}
        />
      </>
    ) : (
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleFollowToggle}
      >
        {isFollowing ? (
          <>
            <SlUserFollowing /> Following
          </>
        ) : (
          <>
            <SlUserFollow /> Follow
          </>
        )}
      </Button>
    )}
  </div>
</div>
{showViewsChart && (
  <div className="w-full max-w-5xl mt-4">
    <ViewsChart authorId={user._id.toString()} title="Views Graph" />
  </div>
)}


      
        {/* Filter Tabs as Links */}
<div className="flex gap-6 justify-center md:justify-start mt-12 mb-6 w-full max-w-5xl border-b border-gray-200">
  <p
    className={`cursor-pointer pb-2 text-lg font-medium ${activeFilter === "blog" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
    onClick={() => setActiveFilter("blog")}
  >
    Blog
  </p>
  <p
    className={`cursor-pointer pb-2 text-lg font-medium ${activeFilter === "savedBlog" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
    onClick={() => setActiveFilter("savedBlog")}
  >
    Saved Blog
  </p>
</div>

      

      {/* Blog Section */}
      <div className="mt-2 w-full max-w-5xl flex flex-col gap-6">
        {(activeFilter === "blog" ? blogs : savedBlogs).length === 0 ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            <p className="text-gray-500 text-center">No blogs yet</p>
          </div>
        ) : (
          (activeFilter === "blog" ? blogs : savedBlogs).map(blog => (
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
    </>
  );
}
