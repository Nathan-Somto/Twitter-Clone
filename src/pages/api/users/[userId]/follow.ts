import connectDb from "@/lib/config/connectDb";
import { follow_user } from "@/lib/controllers/user.controllers";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface dynamicParams {
  userId?: string | mongoose.Types.ObjectId;
}
interface BodyData {
  targetUserId: string | mongoose.Types.ObjectId;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId }: dynamicParams = req.query;
    const { targetUserId }: BodyData = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(userId ?? "") ||
      !mongoose.Types.ObjectId.isValid(targetUserId ?? "")
    ) {
      return res.status(400).json({ error: "Invalid userId or targetUserId" });
    }
    await connectDb();
    if (req.method === "PUT") {
      const response = await follow_user(
        userId as mongoose.Types.ObjectId,
        targetUserId as mongoose.Types.ObjectId
      );
      res.status(200).json(response);
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}
