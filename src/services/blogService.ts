import { Blog } from "@/utils/Types";

export interface CreateBlogData {
  title: string;
  content: string;
  authorId: string;
  category: string;
  image: ImageData; 
}

export async function createBlog(data: CreateBlogData) {
  try {
    const bodyToSend = {
      title: data.title,
      content: data.content,
      category: data.category,
      author: data.authorId,
      image: data.image,
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
  } catch (error) {
    console.error("Failed to create Blog", error);
    throw error;
  }
}

//Save blog

export async function saveBlog(userId:string,blogId:string){

  try{

    const res=await fetch("/api/blogs/saveBlog",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({userId,blogId}),
    });
    if(!res.ok){
      const errorData=await res.json();
      throw new Error(errorData.message || "Failed to save blog");
    }
    const data = await res.json();
    return data.savedBlogs as string[];
  } catch (err) {
    console.error("Error toggling saved blog:",err);
  }

}
//Get Single Blog

export async function getBlogById(id:string){
  try{
  const res=await fetch(`/api/blogs/${id}`,{
    method:"GET",
    headers:{
    "Content-Type": "application/json", 
    }
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res.json();
  }catch(err){
    console.error("Failed to fetch Blog",err)
  }
}
// update

interface ImageData {
  public_id: string;
  folder: string;
  secure_url: string;
}

export async function updateBlog(
  id: string,
  updatedData: Partial<Omit<Blog, "_id"> & { image?: File | ImageData }>
): Promise<Blog> {
  try {
    // Prepare body to send
    const bodyToSend: Partial<Omit<Blog, "_id"> & { image?: ImageData }> = {
      title: updatedData.title,
      content: updatedData.content,
      category: updatedData.category,
    };

    // Handle image
    if (updatedData.image) {
      if (updatedData.image instanceof File) {
        // Upload new image to Cloudinary
        const formData = new FormData();
        formData.append("file", updatedData.image);
        formData.append("type", "blog");

        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadResult = await uploadRes.json();

        if (!uploadRes.ok) throw new Error(uploadResult.error || "Image upload failed");

        // Send new image object to backend
        bodyToSend.image = {
          public_id: uploadResult.public_id,
          folder: uploadResult.folder || "blog/images",
          secure_url: uploadResult.secure_url,
        };
      } else {
        // If it's already ImageData, just send it
        bodyToSend.image = updatedData.image;
      }
    }

    // Call backend PUT
    const res = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyToSend),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update blog");
    }

    return res.json();
  } catch (err) {
    console.error("Failed to Update Blog", err);
    throw err;
  }
}

//Delete Blog

export async function deleteBlog(blogId:string){

  try{
    const res=await fetch(`/api/blogs/${blogId}`, {
       method: "DELETE",
    });
     if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete blog");
    }

    return await res.json(); 
  } catch (err) {
    console.error("Failed to delete Blog",err);
  }
};