export type WithId<T> = T & { id: string };

export type ImageFile = {
  file: File;
  preview: string;
};
