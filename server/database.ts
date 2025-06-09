// server/database.mts
// import { PrismaClient } from './generated/prisma/client.js';
// export const prisma = new PrismaClient();
// database.mts
import { PrismaClient as ProductionPrismaClient } from './generated/prisma-production';
import { PrismaClient as PreviewPrismaClient } from './generated/prisma-preview';

// 导出通用的 PrismaClient 类型
export type PrismaClientType = ProductionPrismaClient | PreviewPrismaClient;

// 创建一个全局的 prisma 实例
let prisma: any = null;

// 获取 prisma 实例的函数
export function getPrisma() {
  if (!prisma) {
    console.log('Initializing Prisma client...');
    console.log('Current NODE_ENV:', process.env.NODE_ENV);
    
    const prismaOptions = {
      datasources: {
        db: {
          url: process.env.NODE_ENV === 'production' 
            ? process.env.DATABASE_URL 
            : process.env.PREVIEW_DATABASE_URL
        }
      }
    };

    if (process.env.NODE_ENV === 'production') {
      console.log('Using production database URL:', process.env.DATABASE_URL);
      prisma = new ProductionPrismaClient(prismaOptions);
    } else {
      console.log('Using preview database URL:', process.env.PREVIEW_DATABASE_URL);
      prisma = new PreviewPrismaClient(prismaOptions);
    }

    // 添加错误处理中间件
    prisma.$use(async (params: any, next: any) => {
      try {
        return await next(params);
      } catch (error: any) {
        if (error?.code === 'P1017') {
          console.log('Connection lost, attempting to reconnect...');
          await prisma.$disconnect();
          prisma = null;
          return getPrisma()[params.model][params.action](params.args);
        }
        throw error;
      }
    });
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
