'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";


export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const[showPassword,setShowPassword]=useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
     await loginUser({ email, password });
    
     toast.success("Successfuly login");
        router.push("/dashboard"); 
         
    } catch(error){
        console.error("Login Failed",error)
        toast.error("Login failed")
    }
  }

  return (
    <>
    

    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In to Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
                            <div className="relative">

              <Input
                id="password"
                type={showPassword?"text":"password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
  <button  type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={()=>setShowPassword((prev)=>!prev)} >
                   
   {showPassword?<EyeOff size={18}/>:<Eye size={18}/>}

                   </button>
            </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-blend-color-burn font-semibold"
            >
              Sign In
            </Button>

            <div className="space-y-2">
              <p className="text-center font-bold">OR</p>
            </div>

            <Button
              variant="secondary"
              onClick={() => signIn("google")}
              className="w-full bg-transparent text-black text-md"
            >
              <FcGoogle  size={42}/>Continue With Google
            </Button>

            <p className="text-center mt-4">
              If You have no Account?{" "}
              <Link href="/signup" className="text-blue-600 font-semibold">
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
    </>
  );
}
