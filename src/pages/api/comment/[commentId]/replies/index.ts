import connectDb from "@/lib/config/connectDb";
import {
  add_reply_to_comment,
  get_replies_to_comment,
} from "@/lib/controllers/comment.controllers";
import CommentValidation from "@/lib/validations/comments";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface dynamicParams {
  commentId?: mongoose.Types.ObjectId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { commentId }: dynamicParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(commentId ?? "")) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    await connectDb();
    switch (req.method) {
      case "GET":
        const getResponse = await get_replies_to_comment(
          commentId as mongoose.Types.ObjectId
        );
        return res.status(200).json(getResponse);
      case "POST":
        const { author, text, tweetId } = req.body;
        const validationResults = CommentValidation.safeParse({
          author,
          text,
          tweetId,
          parentComment: commentId,
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
        const postResponse = await add_reply_to_comment(
            commentId as mongoose.Types.ObjectId,
        //@ts-ignore
          validationResults.data
        );
        return res.status(201).json(postResponse);
        return;
      default:
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}
