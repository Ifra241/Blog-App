import { BlogProp } from "@/lib/models/Blog";

export interface CreateBlogData {
  title: string;
  content: string;
  author: string;
  image?: File | null;
    profilePic?: string;
}

export async function createBlog(data: CreateBlogData): Promise<BlogProp> {
  let imageUrl = "";
  if (data.image) {
    const formData = new FormData();
    formData.append("file", data.image);
    formData.append("upload_preset", "unsigned_preset");
    formData.append("folder", "blog-images");
    const res = await fetch("https://api.cloudinary.com/v1_1/detopi9nv/image/upload", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error?.message || "Image upload failed");
    }
    imageUrl = result.secure_url;
  }

  const bodyToSend = {
    title: data.title,
    content: data.content,
    author: data.author,
    image: imageUrl,
    profilePic: data.profilePic,
  };

  try {
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create blog");
    }
    return res.json();
  } catch {
    throw new Error("Failed to create blog");
  }
}

export async function getBlog(): Promise<BlogProp> {
  const res = await fetch("/api/blogs");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch blogs");
  }
  return res.json();
}
