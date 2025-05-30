import { Request } from 'express';
import { Session } from 'express-session';

interface User {
  id: string;
  role: 'AGENT' | 'BROKER' | 'SELLER' | 'BUYER';
}

interface CustomSession extends Session {
  user?: User;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  session: CustomSession;
} 