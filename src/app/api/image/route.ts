import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const public_id = url.searchParams.get("public_id");
  const folder = url.searchParams.get("folder") || "";

  if (!public_id) {
    return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
  }

  const signedUrl = cloudinary.url(`${folder}/${public_id}`, {
    type: "private",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  });

  return NextResponse.json({ signedUrl });
}
