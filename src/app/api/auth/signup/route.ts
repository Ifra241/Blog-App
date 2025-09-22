import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullname, email, password, profilePic } = body;

    if (!fullname || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User Already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode=Math.floor(100000+Math.random()*900000).toString();
    const verificationCodeExpiry=new Date(Date.now()+15*60*1000);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
      authType: "email",
      isVerified: false,
      verificationCode,
      verificationCodeExpiry,
      createdAt: new Date(),
    });
    await newUser.save();
    
    await sendVerificationEmail(email,verificationCode);

    return NextResponse.json(
      {
        message: "User Created Successfully",
        user: {
          id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePic: newUser.profilePic,
          authType: "email",
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
