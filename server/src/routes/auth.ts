// import { PrismaClient } from '../../generated/prisma';
// import express, { Request, Response, Router, RequestHandler } from 'express';

// const prisma = new PrismaClient();
// const router: Router = express.Router();

// const loginHandler = (async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user || user.password !== password) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   const redirect = `/dashboard/${user.role.toLowerCase()}`;
//   res.json({ message: 'Login successful', role: user.role, redirect });
// }) as RequestHandler; 

// router.post('/login', loginHandler);

// export default router;

// server/src/routes/auth.ts
import express, { Request, Response, Router, RequestHandler } from 'express';
// import { prisma } from '../../database.mts';  
// server/database.ts
import { PrismaClient as ProductionPrismaClient } from '../..//generated/prisma-production';
import { PrismaClient as PreviewPrismaClient } from '../..//generated/prisma-preview';

export const prisma = process.env.NODE_ENV === 'preview'
  ? new PreviewPrismaClient()
  : new ProductionPrismaClient();

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
