import connectDb from "@/lib/config/connectDb";
import mongoose from "mongoose";
import { delete_from_user_bookmarks } from "@/lib/controllers/user.controllers";
import type { NextApiRequest, NextApiResponse } from "next";
interface QueryParams {
  tweetId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId, tweetId }: QueryParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(tweetId ?? "")) {
      return res.status(400).json({ message: "Invalid tweetId" });
    }
    await connectDb();
    if (req.method === "DELETE") {
      const deleteResponse = await delete_from_user_bookmarks(
        userId as mongoose.Types.ObjectId,
        tweetId as mongoose.Types.ObjectId
      );
      return res.status(202).json(deleteResponse);
    }
    return res
      .status(405)
      .json({ status: "failed", message: "Method Not Allowed" });
  } catch (err) {
    console.error((err as unknown as Error)?.message);
    res.status(501).json({ message: "an error just occured" });
  }
}
