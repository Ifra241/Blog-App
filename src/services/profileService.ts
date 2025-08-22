/*export interface User {
  _id: string;
  username: string;
  fullname: string;
  profilePic?: string;
  followers: string[];
  following: string[];
}

export interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: {
    public_id: string;
    folder: string;
    secure_url: string;
  };
  createdAt: string;
  content: string;
}

// Fetch user info by ID
export async function getUser(userId: string): Promise<User | null> {
  try {
    const res = await fetch(`/api/user/${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching user:", err);
    return null; 
  }
}

// Fetch blogs created by user
export async function getUserBlogs(userId: string): Promise<Blog[] | []> {
  try {
    const res = await fetch(`/api/user/${userId}/blogs`);
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching user blogs:", err);
    return []; 
  }
}*/
