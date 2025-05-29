// server/database.mts
// import { PrismaClient } from './generated/prisma/client.js';
// export const prisma = new PrismaClient();
// database.mts
import { PrismaClient as ProductionPrismaClient } from './generated/prisma-production';
import { PrismaClient as PreviewPrismaClient } from './generated/prisma-preview';

// 默认使用 preview 数据库，除非明确指定使用 production
const prisma = (process.env.NODE_ENV === 'production'
  ? new ProductionPrismaClient()
  : new PreviewPrismaClient()) as PreviewPrismaClient;

export { prisma };
