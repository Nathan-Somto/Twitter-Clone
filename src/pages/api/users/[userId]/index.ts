import connectDb from "@/lib/config/connectDb";
import {
  get_user_profile,
  update_user_profile,
  delete_user_profile,
  get_user_tweets,
  get_user_followers,
  get_user_following,
  get_user_follower_suggestion,
} from "@/lib/controllers/user.controllers";
import UserValidation from "@/lib/validations/user";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface dynamicParams {
  userId?: string | mongoose.Types.ObjectId;
  q?: "tweets" | "followers" | "following" | "follow-suggestion";
  pageNumber?: number;
  pageSize?: number;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId, q, pageSize, pageNumber }: dynamicParams = req.query;
    console.log("the userId", userId);
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    await connectDb();
    switch (req.method) {
      case "GET":
        if (!q) {
          const response = await get_user_profile(
            userId as mongoose.Types.ObjectId
          );
          return res.status(200).json(response);
        } else {
          if (q === "tweets") {
            const getResponse = await get_user_tweets(
              userId as mongoose.Types.ObjectId,
              pageSize,
              pageNumber
            );
            return res.status(200).json(getResponse);
          } else if (q === "followers") {
            const response = await get_user_followers(
              userId as mongoose.Types.ObjectId
            );
            return res.status(200).json(response);
          } else if (q === "following") {
            const response = await get_user_following(
              userId as mongoose.Types.ObjectId
            );
            return res.status(200).json(response);
          } else if (q === "follow-suggestion") {
            const response = await get_user_follower_suggestion(
              userId as mongoose.Types.ObjectId
            );
            return res.status(200).json(response);
          } else {
            return res
              .status(400)
              .json({
                error:
                  "bad request q can only be tweets, followers, follow-suggestion, foloowing.",
              });
          }
        }
      case "PUT":
        const {
          bio,
          profileImgUrl,
          profileCoverUrl,
          displayName,
          onBoarded,
          username,
        } = req.body;
        const validationResult = UserValidation.safeParse({
          bio,
          profileImgUrl,
          profileCoverUrl,
          displayName,
          onBoarded,
          username,
        });
        if (!validationResult.success) {
          return res.status(200).json(validationResult.error);
        }
        const putResponse = await update_user_profile(
          userId as mongoose.Types.ObjectId,
          validationResult.data
        );
        return res.status(200).json(putResponse);
      case "DELETE":
        const deleteResponse = await delete_user_profile(
          userId as mongoose.Types.ObjectId
        );
        res.status(300).json(deleteResponse);
      default:
        res.status(405).json({ error: "Method not allowed" });
        break;
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}
