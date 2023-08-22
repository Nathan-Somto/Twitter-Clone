import connectDb from "@/lib/config/connectDb";
import { retweet } from "@/lib/controllers/tweet.controllers";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface dynamicParams {
  userId?: mongoose.Types.ObjectId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId }: dynamicParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res.status(400).json({ error: "Invalid userId or tweetId" });
    }
    const { originalTweetId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(originalTweetId ?? "")) {
      return res.status(400).json({ error: "Original tweet id is invalid" });
    }
      await connectDb();
    if (req.method === "POST") {
      const response = await retweet(
        originalTweetId as mongoose.Types.ObjectId,
        userId as mongoose.Types.ObjectId
      );
      return res.status(200).json(response);
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}
