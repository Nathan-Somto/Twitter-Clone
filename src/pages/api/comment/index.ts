import connectDb from "@/lib/config/connectDb";
import CommentValidation from "@/lib/validations/comments";
import mongoose from "mongoose";
import { add_comment_to_tweet, add_reply_to_comment, get_replies_to_comment } from "@/lib/controllers/comment.controllers";
import type { NextApiRequest, NextApiResponse } from "next";
type queryParams ={
  parentComment?: string | mongoose.Types.ObjectId ;
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
      try{
        await connectDb();
        if(req.method === 'GET'){
          // /api/comment?parentComment:=parentComment
          const {parentComment}: queryParams = req.query
          const getResponse = await get_replies_to_comment(
            parentComment as mongoose.Types.ObjectId
          );
          return res.status(200).json(getResponse);
        }
        if(req.method === 'POST'){
          const { author, text, tweetId, parentComment } = req.body;
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
          let postResponse = {};
          if(parentComment){         
            postResponse = await add_reply_to_comment(
             parentComment as mongoose.Types.ObjectId,
         //@ts-ignore
           {...validationResults.data, parentComment}
         );
          }else{
          postResponse = await add_comment_to_tweet(
            validationResults.data.tweetId as unknown as mongoose.Types.ObjectId,
            //@ts-ignore
              validationResults.data
            );
          }
          return res.status(201).json(postResponse);
        }
      }
      catch(err) {
        res.status(501).json({ message: "an error just occured" });
    
    }
}