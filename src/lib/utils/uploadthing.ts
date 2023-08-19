import { CustomSession } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import {authOptions} from '@/pages/api/auth/[...nextauth]'
 
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
 
const f = createUploadthing();

export const ourFileRouter = {
  
  imageUploader: f({ image: { maxFileSize: "4MB",maxFileCount:2 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
       const session =  await getServerSession(req,res,authOptions);
      console.log(session?.user)
      // If you throw, the user will not be able to upload
      if (!session?.user) throw new Error("Unauthorized"); 
 
      return { userId:(session as CustomSession).user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;