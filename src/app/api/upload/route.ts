import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;//Blob stands for Binary Large Object,high-level object for files(like images,pdfs etc)
    const type = (formData.get("type") as string) || "blog";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();//binary representation of the file,low-level, raw bytes of data stored in memory.
    const buffer = Buffer.from(arrayBuffer);

    const folder = type === "blog" ? "blog/images" : "user/profile";
    const public_id = `${type}_${Date.now()}`;

    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image", public_id },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      public_id: uploadResult.public_id,
      folder: uploadResult.folder || folder,
      secure_url: uploadResult.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
