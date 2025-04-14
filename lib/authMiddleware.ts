import type {NextApiRequest, NextApiResponse} from 'next';
import {verifyToken} from './jwt';
import {AuthenticatedRequest} from './types'; // Import the new type

export const authMiddleware = (
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        try {
            (req as AuthenticatedRequest).user = verifyToken(token) as { userId: number };
            return handler(req as AuthenticatedRequest, res);
        } catch  {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};