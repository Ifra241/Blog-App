"use client";

import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";


interface AuthMessageProps {
  requireLogin?: boolean; 
  message: string;       
  redirectTo?: string;   
}

export default function  AuthMessage({requireLogin,message,redirectTo}:AuthMessageProps){
    const router=useRouter();
    const currentUser=useSelector((state:RootState)=>state.user.currentUser);

    useEffect(()=>{
        if (requireLogin && !currentUser) {
      alert(message);
      if (redirectTo) router.push(redirectTo);
    }
    if (!requireLogin && currentUser) {
      alert(message);
      if (redirectTo) router.push(redirectTo);
    }
  }, [currentUser, requireLogin, message, redirectTo, router]);
   return null;
}