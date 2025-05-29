// server/database.mts
// import { PrismaClient } from './generated/prisma/client.js';
// export const prisma = new PrismaClient();
// database.mts
import { PrismaClient as ProductionPrismaClient } from './generated/prisma-production';
import { PrismaClient as PreviewPrismaClient } from './generated/prisma-preview';

// 创建一个全局的 prisma 实例
let prisma: any = null;

// 获取 prisma 实例的函数
export function getPrisma() {
  if (!prisma) {
    if (process.env.NODE_ENV === 'production') {
      prisma = new ProductionPrismaClient();
    } else {
      prisma = new PreviewPrismaClient();
    }
  }
  return prisma;
}

// 关闭数据库连接的函数
export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}
