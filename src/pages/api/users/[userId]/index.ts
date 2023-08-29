import connectDb from "@/lib/config/connectDb";
import {
  get_user_profile,
  update_user_profile,
  delete_user_profile
} from "@/lib/controllers/user.controllers";
import UserValidation from "@/lib/validations/user";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface dynamicParams {
  userId?: string | mongoose.Types.ObjectId;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId }: dynamicParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    await connectDb();
    switch (req.method) {
      case "GET":
        const response = await get_user_profile(userId as mongoose.Types.ObjectId);
        return res.status(200).json(response)
      case "PUT":
        const { bio, profileImgUrl, profileCoverUrl, displayName, onBoarded,username } =
          req.body;
        const validationResult = UserValidation.safeParse({
          bio,
          profileImgUrl,
          profileCoverUrl,
          displayName,
          onBoarded,
          username
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
