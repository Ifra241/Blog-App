import { BlogProp } from "@/lib/models/Blog";

export interface CreateBlogData {
  title: string;
  content: string;
  authorId: string;
  image: File;
  category:string;
}

export async function createBlog(data: CreateBlogData): Promise<BlogProp> {
  // Upload image to Cloudinary first
  const formData = new FormData();
  formData.append("file", data.image);
  formData.append("type", "blog");

  const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
  const uploadResult = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(uploadResult.error || "Image upload failed");
  }

  const bodyToSend = {
    title: data.title,
    content: data.content,
    category:data.category,
    author: data.authorId,
    image: {
    public_id: uploadResult.public_id,
    folder: uploadResult.folder || "blog/images",
    secure_url: uploadResult.secure_url, 
  },
    
  };

  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyToSend),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error data from /api/blogs:", errorData);
    throw new Error(errorData.error || "Failed to create blog");
  }

  return res.json();
}
