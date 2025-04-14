import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const jobs = await prisma.job.findMany({
        include: {
            user: true,
        },
    });
    return res.status(200).json(jobs);
}