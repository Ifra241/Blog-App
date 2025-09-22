"use client"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyOtp, resendOtp } from "@/services/otpService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtpVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerifyClick = async () => {
    if (!otp) return toast.error("Please enter OTP");
    try {
      await verifyOtp(email, otp);
      toast.success("Email verified!");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err) {
      toast.error((err as Error).message || "Invalid OTP");
    }
  };

  const handleResendClick = async () => {
    try {
      await resendOtp(email);
      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to resend OTP");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>
      <p className="text-sm text-center text-gray-600 mb-6">
        Enter the OTP sent to <span className="font-medium">{email}</span>
      </p>

      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Button
        onClick={handleVerifyClick}
        className="w-full bg-black text-white p-3 rounded-lg mb-4 hover:bg-gray-800 transition"
      >
        Verify
      </Button>

      <p className="text-center text-sm text-gray-500">
        Code not received?{" "}
        <span
          onClick={handleResendClick}
          className="text-blue-600 font-semibold cursor-pointer hover:underline">
          Resend
        </span>
      </p>
    </div>
  </div>
);
}
