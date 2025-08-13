"use client";

import { BlogProp } from "@/lib/models/Blog";
import { createBlog, CreateBlogData } from "@/services/blogService";
import React, { useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { FcAddImage } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState<string|null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
 const fileInputRef=useRef<HTMLInputElement>(null);
//current user
  const currentUser=useSelector((state:RootState)=>state.user.currentUser);

console.log("Current user in CreateBlog:", currentUser);


    function handleImage(e:React.ChangeEvent<HTMLInputElement>){
      if(e.target.files && e.target.files.length>0){
        setImage(e.target.files[0]);
      }
    }
    function handleClick(){
      if(fileInputRef.current){
        fileInputRef.current.click();
      }
    }

  const canPublish = title.trim() !== "" && content.trim() !== "" &&currentUser;

async  function handlePublish() {
  if(!currentUser){
    setError("You need to Login to Publish Blog");
    return;
  }
    if (!canPublish) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try{
      const data:CreateBlogData={
        title,
        content,
        author:currentUser?.fullname||"Unknown",
        profilePic:currentUser?.profilePic|| "/default-avatar.png",
        image,
      };
        console.log("Sending blog data:", data);
      const newBlog:BlogProp=await createBlog(data);
      setSuccess(`Blog "${newBlog.title}"published successfully!`);
      setTitle("");
      setContent("");
      setImage(null);
      }catch{
        setError( "Failed to Publish Blog");
      }finally{
        setLoading(false);
      }

    }
  

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-10 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bloger</h1>
         <div className="flex items-center gap-2">
        <button
          disabled={!canPublish}
          onClick={handlePublish}
          className={`px-4 py-2 rounded-full font-semibold ${
            canPublish
              ? "bg-green-400 text-white hover:bg-green-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
            {loading ? "Publishing..." : "Publish"}

        </button>
       
          <button  className="p-2 rounded-full hover:bg-gray-100"><FiBell size={32} color="darkblue"/></button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <textarea
          placeholder="Title"
          value={title}
          rows={2}
          onChange={(e) => setTitle(e.target.value)}
          
          className="text-5xl font-serif font-semibold placeholder-gray-300 focus:outline-none border-b-2 border-gray-300 pb-2 resize-none"
        />
          <input type="file" ref={fileInputRef} onChange={handleImage} accept="image" style={{display:"none"}} />
        <button
          type="button"
          onClick={handleClick}
          className="w-12 h-12 rounded-full  text-gray-600 text-3xl flex items-center justify-center  hover:bg-gray-100"
        >
          <FcAddImage size={36}/>
        </button>
      </div>

      <textarea
        placeholder="Tell your story..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[400px] resize-none text-lg leading-relaxed placeholder-gray-300 focus:outline-none"
      />
      {error &&<p className="text-red-500 font-semibold">{error}</p>}
      {success &&<p className="text-green-400 font-semibold">{success}</p>}
    </div>
  );
}
