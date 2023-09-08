import connectDb from "@/lib/config/connectDb";
import { verify_user } from "@/lib/controllers/user.controllers";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface dynamicParams {
  userId?: string | mongoose.Types.ObjectId;
}
interface BodyData {
  secretKey?: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId }: dynamicParams = req.query;
    const { secretKey }: BodyData = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res.status(400).json({ error: "Invalid userId or targetUserId" });
    }
    if(!secretKey){
        res.status(400).json({
            status:"failed",
            message:"secretKey is a required parameter."
        })
    }
    const passCode = process.env.TWITTER_BLUE;
    if (!passCode) throw new Error("no passcode on server");
    if (passCode !== secretKey) {
      return res.status(401).json({
        status: "failed",
        message: "wrong secret key.",
      });
    }
    await connectDb();
    if (req.method === "PUT") {
      const response = await verify_user(userId as mongoose.Types.ObjectId);
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }
}
