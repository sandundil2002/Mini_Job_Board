import type { NextApiResponse } from 'next';
import prisma from "@/lib/prisma";
import {authMiddleware} from "@/lib/authMiddleware";
import {AuthenticatedRequest} from "@/lib/types";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const { title, company, location, jobType, description } = req.body;
    const userId = req.user.userId;

    const job = await prisma.job.create({
        data: {
            title,
            company,
            location,
            jobType,
            description,
            user: {
                connect: { id: userId },
            },
        },
    });
    return res.status(201).json(job);
};

export default authMiddleware(handler);