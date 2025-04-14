import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";
import {authMiddleware} from "@/lib/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    await prisma.job.delete({ where: { id: Number(id) } });
    return res.status(200).json({ message: 'Job deleted' });
};

export default authMiddleware(handler);