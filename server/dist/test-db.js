"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
async function testDatabase() {
    try {
        console.log('Testing database connection...');
        console.log('Environment:', process.env.NODE_ENV);
        const prisma = (0, database_1.getPrisma)();
        // 尝试一个简单的查询
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true
            }
        });
        console.log('Database connection successful!');
        console.log('Found users:', users);
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
    finally {
        await (0, database_1.disconnectPrisma)();
    }
}
testDatabase();
