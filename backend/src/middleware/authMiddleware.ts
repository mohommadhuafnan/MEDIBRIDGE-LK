import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'medibridge_lk_super_secret_jwt_key_2026_sri_lanka';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
  userRole?: UserRole;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow demo guest access if explicit header sent
      const demoRole = req.headers['x-demo-role'] as UserRole;
      if (demoRole) {
        req.userRole = demoRole;
        req.userId = `demo-${demoRole.toLowerCase()}`;
        return next();
      }
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Check if demo token
    if (token.startsWith('demo-token-')) {
      const role = token.replace('demo-token-', '').toUpperCase() as UserRole;
      req.userRole = role;
      req.userId = `demo-${role.toLowerCase()}`;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    req.userId = decoded.id;
    req.userRole = decoded.role;

    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
    }

    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`,
      });
      return;
    }
    next();
  };
};
