import { NextResponse } from "next/server";
import { uploadMultipleFiles } from "@/features/upload/upload.service";

export async function POST(req: Request) {
  const formData = await req.formData();
  const bucket = formData.get("bucket") as string;
  const folder = formData.get("folder") as string | null;

  const files = formData.getAll("files") as File[];

  if (!bucket) {
    return NextResponse.json(
      { success: false, error: "Bucket is required" },
      { status: 400 }
    );
  }

  const result = await uploadMultipleFiles(files, {
    bucket,
    folder: folder ?? undefined,
    makePublicUrl: true,
  });

  return NextResponse.json(
    { success: true, data: result },
    { status: 200 }
  );
}
