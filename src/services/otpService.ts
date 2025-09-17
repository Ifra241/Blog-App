export async function verifyOtp(email: string, otp: string) {
  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "OTP verification failed");

    return data; 
  } catch (error) {
    console.error("Error in verifyOtp service:", error);
    throw error;
  }
}

export async function resendOtp(email: string) {
  try {
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

    return data; 
  } catch (error) {
    console.error("Error in resendOtp service:", error);
    throw error;
  }
}
