
export interface User{
    _id:string;
    username:string;
    profilePic?:string;
    followers: string[];
  following: string[];
}
export interface Blog {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}
// Fetch user info by ID
export async function getUser(userId: string): Promise<User> {
  const res = await fetch(`/api/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

    

// Fetch blogs created by user
export async function getUserBlogs(userId: string): Promise<Blog[]> {
  const res = await fetch(`/api/user/${userId}/blogs`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}