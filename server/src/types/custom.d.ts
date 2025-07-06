import { Request } from 'express';
import { Session } from 'express-session';

// User interface
export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  managerId?: string | null;
  managing?: any[];
}

// Extend express-session
declare module 'express-session' {
  interface Session {
    user?: User;
  }
}

// Custom session interface
interface CustomSession extends Session {
  user?: User;
}

// Authenticated request interface
export interface AuthenticatedRequest extends Request {
  user?: User;
  session: CustomSession;
} 