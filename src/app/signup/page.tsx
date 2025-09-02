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
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUser } from "@/store/userSlice";
import { FcGoogle } from "react-icons/fc";


export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await signupUser({ fullname, email, password, confirmPassword, profilePic });

      //  Save user info to Redux
      dispatch(setUser({
        _id: res.user._id,
        username: res.user.fullname,
        fullname:res.user.fullname,
        email: res.user.email,
        profilePic: res.user.profilePic,
      }));

      toast.success(res.message || "Signup successful!");
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
            {/* Fullname */}
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

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="text-red-500 text-sm mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image (optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) setProfilePic(e.target.files[0]);
                }}
              />
            </div>

            <Button
              type="submit"
             className="w-full bg-black hover:bg-blend-color-burn font-semibold"
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
                 className="w-full bg-transparent text-black text-md"

              >
                <FcGoogle  size={42}/>Continue With GoogleContinue With Google
              </Button>
            </div>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 font-semibold">
                SignIN
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
