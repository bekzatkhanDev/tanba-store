export type UploadResult = {
  path: string;       // путь внутри Supabase Storage
  url: string;        // публичный URL
  fileName: string;   // имя файла в бакете
};

export type UploadError = {
  fileName: string;
  error: string;
};

export type UploadManyResult = {
  success: UploadResult[];
  failed: UploadError[];
};

export type UploadConfig = {
  bucket: string;
  folder?: string;     
  makePublicUrl?: boolean; 
};
