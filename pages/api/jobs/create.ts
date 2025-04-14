import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";
import {authMiddleware} from "@/lib/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, company, location, jobType, description } = req.body;
    const job = await prisma.job.create({
        data: { title, company, location, jobType, description },
    });
    return res.status(201).json(job);
};

export default authMiddleware(handler);