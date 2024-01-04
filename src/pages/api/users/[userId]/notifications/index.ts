import mongoose from "mongoose";
import connectDb from "@/lib/config/connectDb";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  delete_all_user_notifications,
  get_unread_notifications,
  get_user_notifications,
  read_user_notifications,
} from "@/lib/controllers/notifications.controllers";

interface dynamicParams {
  userId?: string | mongoose.Types.ObjectId;
  q?: "unread-notifications";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDb();
    const { userId, q }: dynamicParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res
        .status(400)
        .json({ status: "failed", error: "Invalid userId" });
    }
    switch (req.method) {
      case "GET":
        if (!q) {
          const getResponse = await get_user_notifications(
            userId as mongoose.Types.ObjectId
          );
          return res.status(200).json(getResponse);
        } else {
          if (q === "unread-notifications") {
            const getResponse = await get_unread_notifications(
              userId as mongoose.Types.ObjectId
            );
            return res.status(200).json(getResponse);
          } else {
            res
              .status(400)
              .json({ error: "q can only be unread-notifications" });
          }
        }
      case "PUT":
        const putResponse = await read_user_notifications(
          userId as mongoose.Types.ObjectId
        );
        return res.status(201).json(putResponse);
      case "DELETE":
        const deleteResponse = await delete_all_user_notifications(
          userId as mongoose.Types.ObjectId
        );
        return res.status(204).json(deleteResponse);
      default:
        res.status(405).json({ error: "Method not allowed" });
        break;
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}
