"use client";

import { toggleLike } from "@/services/likeService";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";


interface LikeButtonProps {
  blogId: string;
  currentUserId: string;
  currentUserName:string;
  initialLikes: number;
  userHasLiked: boolean;
}
export default function LikeButton({
    blogId,currentUserId, currentUserName,initialLikes,userHasLiked}:LikeButtonProps){
        const[likesCount,setLikesCount]=useState(initialLikes);
        const[hasliked,setHasLiked]=useState(userHasLiked);
        const[loading ,setLoading]=useState(false);
    
            const handClick=async()=>{
                if(loading)return;
                setLoading(true);
            
            
        try{
            const data=await toggleLike(blogId,currentUserId,currentUserName);
            setLikesCount(data.likesCount);
            setHasLiked(data.message==="Liked");

     } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
}

return( <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={handClick}
    >
      {hasliked ? <FaHeart  size={24}/> : <FiHeart size={22} />}
      <span>{likesCount}</span>
    </div>


);
}