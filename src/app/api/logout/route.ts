import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({ message: "Logged out" });
    const token = response.cookies.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "You are not logged in", redirect: "/login" },
        { status: 401 }
      );
    }

    response.cookies.set("token", "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong during logout" },
      { status: 500 }
    );
  }
}
