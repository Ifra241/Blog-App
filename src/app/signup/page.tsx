'use client';

import { useState, FormEvent } from "react";
import { signupUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const[image,setImage]=useState<File|null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      

    
      const result = await signupUser({ fullname, email, password, confirmPassword,image });

      toast.success(result.message || "Signup successful!");

      router.push("/signin");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                required
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
                {password.length > 0 && password.length < 6 && (
    <p className="text-red-500 text-sm mt-1">
      Password must be at least 8 characters
    </p>
  )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>

            <div className="space-y-2">
  <Label htmlFor="image">Profile Image (optional)</Label>
  <Input
    id="image"
    type="file"
    accept="image/*"
    onChange={(e)=>{
        if(e.target.files){
            setImage(e.target.files[0]);
        }
    }}
    
  />
</div>


            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <div className="space-y-2 text-center">
              <p className="font-bold">OR</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => signIn("google")}
                className="w-full bg-blue-600 text-white hover:bg-blue-500"
              >
                Continue With Google
              </Button>
            </div>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
