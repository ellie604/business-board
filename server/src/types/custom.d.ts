import { Request } from 'express';
import { Session } from 'express-session';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  session: Session & {
    user?: {
      id: string;
      role: string;
    }
  }
} 