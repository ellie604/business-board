"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_production_1 = require("./generated/prisma-production");
const prisma_preview_1 = require("./generated/prisma-preview");
// 使用 Preview 类型作为基准类型
const prisma = (process.env.NODE_ENV === 'production'
    ? new prisma_production_1.PrismaClient()
    : new prisma_preview_1.PrismaClient());
async function testDatabase() {
    try {
        console.log('Current NODE_ENV:', process.env.NODE_ENV);
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
                password: true
            }
        });
        console.log('Connected to database successfully');
        console.log('Users in database:', users);
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
console.log('Starting database test...');
testDatabase();
