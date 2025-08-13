import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body:", body); // <-- Debug: check what front-end sends

    const { fullname, email, password, profilePic } = body;

    // Validate input
    if (!fullname || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Connect to DB
    await connectToDatabase();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User Already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure profilePic has a value
    let imageUrl = profilePic;
    if (!imageUrl || imageUrl === "") {
      const firstLetter = fullname.charAt(0).toUpperCase();
      imageUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/w_200,h_200,c_fill,r_max,co_white,g_center,l_text:Arial_100_bold:${firstLetter}/v1/avatar.png`;
    }

    // Create user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      profilePic: imageUrl,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User Created Successfully",
        user: {
          id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
