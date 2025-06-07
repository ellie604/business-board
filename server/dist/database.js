"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrisma = getPrisma;
exports.disconnectPrisma = disconnectPrisma;
// server/database.mts
// import { PrismaClient } from './generated/prisma/client.js';
// export const prisma = new PrismaClient();
// database.mts
const prisma_production_1 = require("./generated/prisma-production");
const prisma_preview_1 = require("./generated/prisma-preview");
// 创建一个全局的 prisma 实例
let prisma = null;
// 获取 prisma 实例的函数
function getPrisma() {
    if (!prisma) {
        console.log('Initializing Prisma client...');
        console.log('Current NODE_ENV:', process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'production') {
            console.log('Using production database URL:', process.env.DATABASE_URL);
            prisma = new prisma_production_1.PrismaClient();
        }
        else {
            console.log('Using preview database URL:', process.env.PREVIEW_DATABASE_URL);
            prisma = new prisma_preview_1.PrismaClient();
        }
    }
    return prisma;
}
// 关闭数据库连接的函数
async function disconnectPrisma() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
}
