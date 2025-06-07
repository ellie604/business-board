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
    console.log('Initializing Prisma client...');
    console.log('Current NODE_ENV:', process.env.NODE_ENV);
    
    if (process.env.NODE_ENV === 'production') {
      console.log('Using production database URL:', process.env.DATABASE_URL);
      prisma = new ProductionPrismaClient();
    } else {
      console.log('Using preview database URL:', process.env.PREVIEW_DATABASE_URL);
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
