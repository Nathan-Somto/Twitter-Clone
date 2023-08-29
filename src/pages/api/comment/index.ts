import connectDb from "@/lib/config/connectDb";
import CommentValidation from "@/lib/validations/comments";
import mongoose from "mongoose";
import { add_comment_to_tweet } from "@/lib/controllers/comment.controllers";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
      try{
        await connectDb()
        const { author, text, tweetId } = req.body;
        const validationResults = CommentValidation.safeParse({
          author,
          text,
          tweetId
        });
        if (!validationResults.success) {
          return res.status(400).json(validationResults.error);
        }
        if (
          !mongoose.Types.ObjectId.isValid(validationResults.data.author) ||
          !mongoose.Types.ObjectId.isValid(validationResults.data.tweetId)
        ) {
          return res.status(400).json({ error: "Invalid author or tweetId" });
        }
        const postResponse = await add_comment_to_tweet(
        validationResults.data.tweetId as unknown as mongoose.Types.ObjectId,
        //@ts-ignore
          validationResults.data
        );
        return res.status(201).json(postResponse);
      }
      catch(err) {
        res.status(501).json({ message: "an error just occured" });
    
    }
}