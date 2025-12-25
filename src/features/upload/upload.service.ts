import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  UploadConfig,
  UploadManyResult,
  UploadResult,
  UploadError,
} from "./upload.types";

// Генерация уникального имени: timestamp + случайный суффикс + оригинальное имя (чистое)
function generateUniqueName(original: string) {
  const cleanName = original.replace(/\s+/g, "_");
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}-${cleanName}`;
}

// Создание публичного URL
function buildPublicUrl(bucket: string, filePath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
}


/**
 * Загрузка ОДНОГО файла в Supabase Storage
 */
export async function uploadSingleFile(
  file: File,
  config: UploadConfig
): Promise<UploadResult | null> {
  const bucket = config.bucket;
  const folder = config.folder ?? "";
  const makePublic = config.makePublicUrl ?? true;

  const fileName = generateUniqueName(file.name);
  const fullPath = folder ? `${folder}/${fileName}` : fileName;

  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fullPath, arrayBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload single error:", error);
    return null;
  }

  const url = makePublic ? buildPublicUrl(bucket, fullPath) : "";

  return {
    path: fullPath,
    url,
    fileName,
  };
}


/**
 * Загрузка НЕСКОЛЬКИХ файлов
 */
export async function uploadMultipleFiles(
  files: File[],
  config: UploadConfig
): Promise<UploadManyResult> {
  const success: UploadResult[] = [];
  const failed: UploadError[] = [];

  for (const file of files) {
    try {
      const uploaded = await uploadSingleFile(file, config);
      if (uploaded) {
        success.push(uploaded);
      } else {
        failed.push({
          fileName: file.name,
          error: "Unknown upload error",
        });
      }
    } catch (err) {
      console.error("uploadMultipleFiles error:", err);
      failed.push({
        fileName: file.name,
        error: "Internal upload failure",
      });
    }
  }

  return { success, failed };
}


/**
 * Удаление одного файла
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Delete file error:", error);
    return false;
  }

  return true;
}


/**
 * Удаление нескольких файлов
 */
export async function deleteFiles(
  bucket: string,
  paths: string[]
): Promise<{ deleted: string[]; failed: string[] }> {
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const path of paths) {
    const ok = await deleteFile(bucket, path);
    if (ok) deleted.push(path);
    else failed.push(path);
  }

  return { deleted, failed };
}
