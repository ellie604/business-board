"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_production_1 = require("./generated/prisma-production");
const prisma = new prisma_production_1.PrismaClient();
async function main() {
    const broker = await prisma.broker.upsert({
        where: { email: 'broker@example.com' },
        update: {},
        create: {
            name: 'Alice Broker',
            email: 'broker@example.com',
            password: '123456',
        },
    });
    await prisma.user.upsert({
        where: { email: 'broker@example.com' },
        update: {},
        create: {
            email: 'broker@example.com',
            password: '123456',
            role: 'BROKER',
        },
    });
    await prisma.user.createMany({
        data: [
            {
                email: 'agent1@example.com',
                password: '123456',
                role: 'AGENT',
                brokerId: broker.id,
            },
            {
                email: 'agent2@example.com',
                password: '123456',
                role: 'AGENT',
                brokerId: broker.id,
            },
        ],
        skipDuplicates: true,
    });
    await prisma.user.createMany({
        data: [
            {
                email: 'seller1@example.com',
                password: '123456',
                role: 'SELLER',
                brokerId: broker.id,
            },
            {
                email: 'seller2@example.com',
                password: '123456',
                role: 'SELLER',
                brokerId: broker.id,
            },
        ],
        skipDuplicates: true,
    });
    await prisma.user.createMany({
        data: [
            {
                email: 'buyer1@example.com',
                password: '123456',
                role: 'BUYER',
                brokerId: broker.id,
            },
            {
                email: 'buyer2@example.com',
                password: '123456',
                role: 'BUYER',
                brokerId: broker.id,
            },
        ],
        skipDuplicates: true,
    });
    console.log('Seed data inserted!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
