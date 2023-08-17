import connectDb from '@/lib/config/connectDb';
import { get_users } from '@/lib/controllers/user.controllers'
import type { NextApiRequest, NextApiResponse } from 'next'
interface QueryParams {
    searchTerm?: string;
    pageSize?: number;
    pageNumber?: number;
    sortBy?: string;
  }
  
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try{
        const { searchTerm, pageSize, pageNumber, sortBy }: QueryParams = req.query;
        connectDb()
        if(req.method === 'GET') {
            const response = await get_users(searchTerm, pageNumber, pageSize, sortBy);
            res.status(200).json(response)
        }
    }
    catch(err) {
        res.status(501).json({message: "an error just occured"})
    }
    
  }