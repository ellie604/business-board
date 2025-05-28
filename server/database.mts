// server/database.mts
// import { PrismaClient } from './generated/prisma/client.js';
// export const prisma = new PrismaClient();
// database.mts
import { PrismaClient as ProductionPrismaClient } from './generated/prisma-production/client.js';
import { PrismaClient as PreviewPrismaClient } from './generated/prisma-preview/client.js';

const createPrismaClient = () => {
  if (process.env.NODE_ENV === 'preview') {
    return new PreviewPrismaClient();
  }
  return new ProductionPrismaClient();
};

export const prisma = createPrismaClient();
