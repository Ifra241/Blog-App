"use client";
import { RootState } from "@/store/store";
import { logoutUser } from "@/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Image from "next/image";
import { FiBell } from "react-icons/fi";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";
import type { User as ReduxUser } from "@/store/userSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";




export default function Header(){
      const currentUser = useSelector((state: RootState) => state.user.currentUser);
        const [user, setUser] = useState<ReduxUser | null>(null);
      
    
    const dispatch = useDispatch();
      const router = useRouter();

    //Handle click 
  const handleClick = () => {
    if (currentUser) router.push("/createblog");
    else {
      toast.message("Need to login to create blog", { position: "top-center" });
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    }
  };
//Logout
  const handleLogout =async () => {
    await fetch("/api/logout");
    if (!currentUser) {
      toast.message("You are not logged in",{position:"top-center"});
      return;
    }
    dispatch(logoutUser());
    router.push("/");
  };

   useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser) as ReduxUser);
      else if (currentUser) setUser(currentUser);
    }, [currentUser]);
    return(
              <nav className="flex flex-col md:flex-row justify-between items-center px-4 py-6 gap-4 md:gap-0">


                  {/* Logo */}
                            <div className="text-2xl font-bold mt-2 ml-1">📚Blogger</div>
    {/* Title */}
    <div>
      <h1 className="text-2xl font-bold mt-2 text-center md:text-left">
   Create a unique and beautiful blog
    </h1>
    </div>

     {/* Action Buttons */}

     
        {/* Write */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleClick}
            className="text-xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100"
          >
            📝 Write
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FiBell size={28} color="darkblue" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Notification
            </TooltipContent>
          </Tooltip>

          <Link href={`/profile/${user?._id}`} className="flex items-center gap-2">
            {user?.profilePic ? (
              <Image
                src={user.profilePic}
                alt={user?.username || "User profile picture"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {user?.fullname?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleLogout} className="hover:bg-gray-200">
                <CiLogout size={40} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Logout
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
     
    )
}