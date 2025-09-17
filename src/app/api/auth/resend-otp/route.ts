import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (user.isVerified) return NextResponse.json({ message: "User already verified" }, { status: 400 });

    // Generate new OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); 

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({ message: "OTP resent successfully!" });
  } catch (err) {
    console.error("[RESEND_OTP_ERROR]", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
