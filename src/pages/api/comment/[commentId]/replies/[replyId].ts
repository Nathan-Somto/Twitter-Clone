import connectDb from "@/lib/config/connectDb";
import {
  delete_reply_to_comment
} from "@/lib/controllers/comment.controllers";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface dynamicParams {
  commentId?: mongoose.Types.ObjectId;
  replyId?: mongoose.Types.ObjectId
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try{
        const { commentId, replyId }: dynamicParams = req.query;
        if (!mongoose.Types.ObjectId.isValid(commentId ?? "") || !mongoose.Types.ObjectId.isValid(replyId ?? "")) {
          return res.status(400).json({ error: "Invalid commentId or replyId" });
        }
        connectDb();
        if(req.method  === "DELETE"){
            const deleteResponse = await delete_reply_to_comment(commentId as mongoose.Types.ObjectId, replyId as mongoose.Types.ObjectId);
            return res.status(300).json(deleteResponse);
        }
    }
    catch(err) {
        res.status(501).json({ message: "an error just occured" });
    
    }
}