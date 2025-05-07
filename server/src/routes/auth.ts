import { PrismaClient } from '../../generated/prisma';
import express, { Request, Response, Router, RequestHandler } from 'express';

const prisma = new PrismaClient();
const router: Router = express.Router();

const loginHandler = (async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const redirect = `/dashboard/${user.role.toLowerCase()}`;
  res.json({ message: 'Login successful', role: user.role, redirect });
}) as RequestHandler; 

router.post('/login', loginHandler);

export default router;
