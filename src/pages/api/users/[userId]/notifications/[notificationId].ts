import mongoose from "mongoose";
import connectDb from "@/lib/config/connectDb";
import type { NextApiRequest, NextApiResponse } from "next";
import { delete_user_notification, get_unread_notifications } from "@/lib/controllers/notifications.controllers";
interface dynamicParams {
  userId?: string | mongoose.Types.ObjectId;
  notificationId?: string | mongoose.Types.ObjectId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDb();
    const { userId, notificationId }: dynamicParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res
        .status(400)
        .json({ status: "failed", error: "Invalid userId" });
    }
    if (!mongoose.Types.ObjectId.isValid(notificationId ?? "")) {
        return res
          .status(400)
          .json({ status: "failed", error: "Invalid notificationIdId" });
      }
    if (req.method === "DELETE") {
      const getResponse = await delete_user_notification(
        userId as mongoose.Types.ObjectId,
        notificationId as mongoose.Types.ObjectId
      );
      return res.status(200).json(getResponse);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}