"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_production_1 = require("./generated/prisma-production");
const prisma = new prisma_production_1.PrismaClient();
async function main() {
    // Create broker
    const broker = await prisma.user.create({
        data: {
            name: 'Alice Broker',
            email: 'broker@example.com',
            password: '123456',
            role: 'BROKER',
        },
    });
    // Create agents
    const agents = await Promise.all([
        prisma.user.create({
            data: {
                email: 'agent1@example.com',
                password: '123456',
                role: 'AGENT',
                managerId: broker.id,
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
    // Create sellers with documents
    const seller1 = await prisma.user.create({
        data: {
            email: 'seller1@example.com',
            password: '123456',
            role: 'SELLER',
            managerId: broker.id,
        },
    });
    const seller2 = await prisma.user.create({
        data: {
            email: 'seller2@example.com',
            password: '123456',
            role: 'SELLER',
            managerId: broker.id,
        },
    });
    const seller3 = await prisma.user.create({
        data: {
            email: 'seller3@example.com',
            password: '123456',
            role: 'SELLER',
            managerId: broker.id,
        },
    });
    // Create documents for seller1
    await Promise.all([
        prisma.document.createMany({
            data: [
                { type: prisma_production_1.DocumentType.EMAIL_AGENT, status: 'COMPLETED', sellerId: seller1.id },
                { type: prisma_production_1.DocumentType.LISTING_AGREEMENT, status: 'COMPLETED', sellerId: seller1.id },
                { type: prisma_production_1.DocumentType.QUESTIONNAIRE, status: 'PENDING', sellerId: seller1.id },
                { type: prisma_production_1.DocumentType.UPLOADED_DOC, status: 'PENDING', sellerId: seller1.id }
            ]
        })
    ]);
    // Create documents for seller2
    await Promise.all([
        prisma.document.createMany({
            data: [
                { type: prisma_production_1.DocumentType.EMAIL_AGENT, status: 'COMPLETED', sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.LISTING_AGREEMENT, status: 'COMPLETED', sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.QUESTIONNAIRE, status: 'COMPLETED', sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.UPLOADED_DOC, status: 'COMPLETED', sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.PURCHASE_AGREEMENT, status: 'PENDING', sellerId: seller2.id }
            ]
        })
    ]);
    // Create documents for seller3
    await Promise.all([
        prisma.document.createMany({
            data: [
                { type: prisma_production_1.DocumentType.EMAIL_AGENT, status: 'COMPLETED', sellerId: seller3.id },
                { type: prisma_production_1.DocumentType.LISTING_AGREEMENT, status: 'COMPLETED', sellerId: seller3.id },
                { type: prisma_production_1.DocumentType.QUESTIONNAIRE, status: 'PENDING', sellerId: seller3.id },
                { type: prisma_production_1.DocumentType.UPLOADED_DOC, status: 'PENDING', sellerId: seller3.id }
            ]
        })
    ]);
    // Create buyers
    const buyer1 = await prisma.user.create({
        data: {
            email: 'buyer1@example.com',
            password: '123456',
            role: 'BUYER',
            managerId: broker.id,
        },
    });
    const buyer2 = await prisma.user.create({
        data: {
            email: 'buyer2@example.com',
            password: '123456',
            role: 'BUYER',
            managerId: broker.id,
        },
    });
    const buyer3 = await prisma.user.create({
        data: {
            email: 'buyer3@example.com',
            password: '123456',
            role: 'BUYER',
            managerId: broker.id,
        },
    });
    // Create documents for buyer1
    await Promise.all([
        prisma.document.createMany({
            data: [
                { type: prisma_production_1.DocumentType.EMAIL_AGENT, status: 'COMPLETED', buyerId: buyer1.id, sellerId: seller1.id },
                { type: prisma_production_1.DocumentType.NDA, status: 'COMPLETED', buyerId: buyer1.id, sellerId: seller1.id },
                { type: prisma_production_1.DocumentType.FINANCIAL_STATEMENT, status: 'PENDING', buyerId: buyer1.id, sellerId: seller1.id },
                { type: prisma_production_1.DocumentType.CBR_CIM, status: 'PENDING', buyerId: buyer1.id, sellerId: seller1.id }
            ]
        })
    ]);
    // Create documents for buyer2
    await Promise.all([
        prisma.document.createMany({
            data: [
                { type: prisma_production_1.DocumentType.EMAIL_AGENT, status: 'COMPLETED', buyerId: buyer2.id, sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.NDA, status: 'COMPLETED', buyerId: buyer2.id, sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.FINANCIAL_STATEMENT, status: 'COMPLETED', buyerId: buyer2.id, sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.CBR_CIM, status: 'COMPLETED', buyerId: buyer2.id, sellerId: seller2.id },
                { type: prisma_production_1.DocumentType.PURCHASE_CONTRACT, status: 'PENDING', buyerId: buyer2.id, sellerId: seller2.id }
            ]
        })
    ]);
    // Create documents for buyer3
    await Promise.all([
        prisma.document.createMany({
            data: [
                { type: prisma_production_1.DocumentType.EMAIL_AGENT, status: 'COMPLETED', buyerId: buyer3.id, sellerId: seller3.id },
                { type: prisma_production_1.DocumentType.NDA, status: 'COMPLETED', buyerId: buyer3.id, sellerId: seller3.id },
                { type: prisma_production_1.DocumentType.FINANCIAL_STATEMENT, status: 'PENDING', buyerId: buyer3.id, sellerId: seller3.id },
                { type: prisma_production_1.DocumentType.CBR_CIM, status: 'PENDING', buyerId: buyer3.id, sellerId: seller3.id }
            ]
        })
    ]);
    console.log('Production seed data inserted!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
