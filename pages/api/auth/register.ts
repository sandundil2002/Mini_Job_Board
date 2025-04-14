import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/jwt';
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        const token = signToken({ userId: user.id });
        return res.status(201).json({ token });
    } catch {
        return res.status(400).json({ message: 'User already exists' });
    }
}