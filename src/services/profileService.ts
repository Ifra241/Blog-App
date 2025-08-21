
export interface User{
    _id:string;
    username:string;
    fullname:string;
    profilePic?:string;
    followers: string[];
  following: string[];
}
export interface Blog {
  _id: string;
  title: string;
  description: string;
   image?: {        // not string
    public_id: string;
    folder: string;
    secure_url: string;
  };
  createdAt: string;
  content:string;
}
// Fetch user info by ID
export async function getUser(userId: string): Promise<User> {
  const res = await fetch(`/api/user/${userId}`);
    console.log("getUser response status:", res.status);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

    

// Fetch blogs created by user
export async function getUserBlogs(userId: string): Promise<Blog[]> {
  const res = await fetch(`/api/user/${userId}/blogs`);
    console.log("getUserBlogs response status:", res.status)
  if (!res.ok) throw new Error("Failed to fetch blogs");
   const data = await res.json();
  console.log("getUserBlogs data:", data); 
  return data;
}