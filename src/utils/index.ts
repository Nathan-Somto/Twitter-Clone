import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { OurFileRouter } from "@/lib/utils/uploadthing";
 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
