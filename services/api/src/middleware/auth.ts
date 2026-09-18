import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'festflow_secret';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token nao fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalido ou expirado' });
  }
};

export const authMiddleware = authenticate;