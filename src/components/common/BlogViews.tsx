"use client"
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  blogId: string;
  initialViews: number;
}

export default function BlogViews({blogId,initialViews}:Props){
const[views,setViews]=useState(initialViews);

useEffect(()=>{
    const viewedBlogs=JSON.parse(sessionStorage.getItem("viewedBlogs")||"[]")
      if (!viewedBlogs.includes(blogId)) {
   axios.post(`/api/blogs/${blogId}/increment-view`)
    .then(res=>setViews(res.data.views))
    .catch(err => console.error(err));

    //Mark in seesion store
    sessionStorage.setItem("viewedBlogs",JSON.stringify([...viewedBlogs,blogId])
);
    }
},[blogId]);
  return <span>{views}</span>;

}