import connectDb from '@/lib/config/connectDb';
import { get_user_followers } from '@/lib/controllers/user.controllers';
import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'

interface dynamicParams {
    userId?: string | mongoose.Types.ObjectId;
  }

export default async  function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
try{
    const { userId }: dynamicParams = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId ?? "")) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    connectDb();
    if(req.method === 'GET') {
        const response = await get_user_followers(userId as mongoose.Types.ObjectId,);
        res.status(200).json(response)
    }
}catch (err) {
    res.status(501).json({ message: "an error just occured" });
  }

}