"use client";
import { RootState } from "@/store/store";
import { logoutUser } from "@/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { usePathname, useRouter } from "next/navigation";
import type { User as ReduxUser } from "@/store/userSlice";
import { Tooltip,TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";
import { TfiWrite } from "react-icons/tfi";
import { Input } from "../ui/input";
import { IoSearch } from "react-icons/io5";


interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps){
      const currentUser = useSelector((state: RootState) => state.user.currentUser);
        const [user, setUser] = useState<ReduxUser | null>(null);
        const pathname=usePathname();
        const isDashboard=pathname==="/dashboard"

      
    
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
                  <div className="flex items-center gap-4 flex-1">

                            <div className="text-2xl font-bold mt-2 ml-1">📚Blogger</div>
    {/* Search Bar */}
    {isDashboard && searchQuery !== undefined && setSearchQuery && (

    <div className="relative flex-1 max-w-md mt-4">
      <Input type="text" value={searchQuery} placeholder="Serach blogs..." onChange={(e)=>setSearchQuery(e.target.value)}
       className="pl-10 pr-5 rounded-full border-gray-400"/>
         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
<IoSearch size={24} /></span>
    </div>
    )}
</div>

  

     {/* Action Buttons */}

     
        {/* Write */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleClick}
            className=" flex items-center text-xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100"
          >
            <TfiWrite /> Write
          </button>
        <NotificationBell userId={user?._id || ""}  />


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
                <CiLogout size={40}  title="LogOut"/>
              </button>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </nav>
     
    )
}