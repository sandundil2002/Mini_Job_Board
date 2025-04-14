import type {NextApiRequest, NextApiResponse} from 'next';
import {verifyToken} from './jwt';

export const authMiddleware = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        try {
            (req as NextApiRequest & { user: ReturnType<typeof verifyToken> }).user = verifyToken(token);
            return handler(req, res);
        } catch {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}