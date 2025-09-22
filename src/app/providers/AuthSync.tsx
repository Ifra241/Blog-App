"use client";

import { logoutUser, setUser } from "@/store/userSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check localStorage first (JWT login)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
        return; // Prevent overwriting JWT with Google session
      }
    }

    // Google (NextAuth)
    if (status === "authenticated" && session?.user) {
      dispatch(
        setUser({
          _id: session.user.id,
          fullname: session.user.name || "",
          username: session.user.name || "",
          email: session.user.email || "",
          profilePic: session.user.image || "",
          savedBlogs: [],
          authType: session.user.authType || "google", //  ensure authType
        })
      );
    }

    //  No user at all
    if (!session && !localStorage.getItem("user")) {
      dispatch(logoutUser());
    }

  }, [session, status, dispatch]);

  return <>{children}</>;
}
