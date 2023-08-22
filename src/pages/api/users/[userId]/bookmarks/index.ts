import mongoose from "mongoose";
import connectDb from "@/lib/config/connectDb";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  add_to_user_bookmarks,
  get_user_bookmarks,
} from "@/lib/controllers/user.controllers";

interface dynamicParams {
  userId?: string | mongoose.Types.ObjectId;
  pageSize?: number;
  pageNumber?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDb();
    const { userId, pageSize, pageNumber }: dynamicParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res
        .status(400)
        .json({ status: "failed", error: "Invalid userId" });
    }
    switch (req.method) {
      case "GET":
        const getResponse = await get_user_bookmarks(
          userId as mongoose.Types.ObjectId,
          pageSize,
          pageNumber
        );
        return res.status(200).json(getResponse);
      case "PUT":
        // extract tweet id.
        const { tweetId } = req.body;
        // validate it.
        if (!mongoose.Types.ObjectId.isValid(tweetId ?? "")) {
          return res
            .status(400)
            .json({ status: "failed", error: "Invalid  tweetId" });
        }
        // pass the neccessary info to the controller.
        const putResponse = await add_to_user_bookmarks(
          userId as mongoose.Types.ObjectId,
          tweetId as mongoose.Types.ObjectId
        );
        return res.status(201).json(putResponse);
      default:
        res.status(405).json({ error: "Method not allowed" });
        break;
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}
