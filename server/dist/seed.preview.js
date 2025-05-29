"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// seed.preview.ts
const prisma_preview_1 = require("./generated/prisma-preview");
const prisma = new prisma_preview_1.PrismaClient();
async function main() {
    // 创建 broker（现在作为 User）
    const broker = await prisma.user.create({
        data: {
            name: 'Alice Broker',
            email: 'broker@example.com',
            password: '123456',
            role: 'BROKER',
        },
    });
    // 创建 agents
    const agents = await Promise.all([
        prisma.user.create({
            data: {
                email: 'agent1@example.com',
                password: '123456',
                role: 'AGENT',
                managerId: broker.id, // 现在使用 managerId 而不是 brokerId
            },
        }),
        prisma.user.create({
            data: {
                email: 'agent2@example.com',
                password: '123456',
                role: 'AGENT',
                managerId: broker.id,
            },
        }),
    ]);
    // 创建 sellers
    const sellers = await Promise.all([
        prisma.user.create({
            data: {
                email: 'seller1@example.com',
                password: '123456',
                role: 'SELLER',
                managerId: broker.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'seller2@example.com',
                password: '123456',
                role: 'SELLER',
                managerId: broker.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'seller3@example.com',
                password: '123456',
                role: 'SELLER',
                managerId: broker.id,
            },
        }),
    ]);
    // 创建 buyers
    const buyers = await Promise.all([
        prisma.user.create({
            data: {
                email: 'buyer1@example.com',
                password: '123456',
                role: 'BUYER',
                managerId: broker.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'buyer2@example.com',
                password: '123456',
                role: 'BUYER',
                managerId: broker.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'buyer3@example.com',
                password: '123456',
                role: 'BUYER',
                managerId: broker.id,
            },
        }),
    ]);
    console.log('Preview seed data inserted!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
