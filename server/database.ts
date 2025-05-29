// server/database.ts
// import { PrismaClient } from './generated/prisma/client.js';
// export const prisma = new PrismaClient();
// database.mts
import { PrismaClient } from './generated/prisma-preview';

const prisma = new PrismaClient();

export { prisma };
