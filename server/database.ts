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
            ? process.env.PRO_DATABASE_URL 
            : process.env.PREVIEW_DATABASE_URL
        }
      }
    };

    try {
      if (process.env.NODE_ENV === 'production') {
        console.log('Using production database');
        prisma = new ProductionPrismaClient(prismaOptions);
      } else {
        console.log('Using preview database');
        prisma = new PreviewPrismaClient(prismaOptions);
      }

      // 简化错误处理中间件 - 减少重连尝试
      prisma.$use(async (params: any, next: any) => {
        const startTime = Date.now();
        try {
          const result = await next(params);
          const duration = Date.now() - startTime;
          
          // 只在查询时间过长时记录日志
          if (duration > 1000) {
            console.log(`Slow query detected: ${params.model}.${params.action} took ${duration}ms`);
          }
          
          return result;
        } catch (error: any) {
          const duration = Date.now() - startTime;
          console.error(`Database error after ${duration}ms:`, error.message);
          
          // 不要重置prisma实例，让它自己处理重连
          throw error;
        }
      });

      // 设置连接预热
      if (process.env.NODE_ENV === 'production') {
        prisma.$connect().catch((error: any) => {
          console.error('Failed to connect to database:', error);
        });
      }
    } catch (error: any) {
      console.error('Failed to initialize Prisma client:', error);
      throw error;
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

// 添加连接健康检查
export async function checkDatabaseHealth() {
  try {
    const prismaInstance = getPrisma();
    await prismaInstance.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
