// seed.preview.ts
import { PrismaClient, DocumentType, DocumentStatus } from './generated/prisma-preview';
import { getPrisma } from './database';
import { UserRole } from './generated/prisma-preview';

const prisma = getPrisma();

async function main() {
  // Create broker
  const broker = await prisma.user.create({
    data: {
      name: "Alice Broker",
      email: "broker@example.com",
      password: "123456",
      role: UserRole.BROKER,
    }
  });

  // Create agents
  const agents = await Promise.all([
    prisma.user.create({
      data: {
        name: "David Agent",
        email: "agent1@example.com",
        password: "123456",
        role: UserRole.AGENT,
        managedBy: {
          connect: {
            id: broker.id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Eve Agent",
        email: "agent2@example.com",
        password: "123456",
        role: UserRole.AGENT,
        managedBy: {
          connect: {
            id: broker.id
          }
        }
      }
    })
  ]);

  // Create sellers
  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Frank Seller",
        email: "seller1@example.com",
        password: "123456",
        role: UserRole.SELLER,
        managedBy: {
          connect: {
            id: agents[0].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Grace Seller",
        email: "seller2@example.com",
        password: "123456",
        role: UserRole.SELLER,
        managedBy: {
          connect: {
            id: agents[0].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Henry Seller",
        email: "seller3@example.com",
        password: "123456",
        role: UserRole.SELLER,
        managedBy: {
          connect: {
            id: agents[1].id
          }
        }
      }
    })
  ]);

  // Create documents for seller1
  await Promise.all([
    prisma.document.createMany({
      data: [
        { type: DocumentType.EMAIL_AGENT, status: DocumentStatus.COMPLETED, sellerId: sellers[0].id },
        { type: DocumentType.LISTING_AGREEMENT, status: DocumentStatus.COMPLETED, sellerId: sellers[0].id },
        { type: DocumentType.QUESTIONNAIRE, status: DocumentStatus.PENDING, sellerId: sellers[0].id },
        { type: DocumentType.UPLOADED_DOC, status: DocumentStatus.PENDING, sellerId: sellers[0].id }
      ]
    })
  ]);

  // Create documents for seller2
  await Promise.all([
    prisma.document.createMany({
      data: [
        { type: DocumentType.EMAIL_AGENT, status: DocumentStatus.COMPLETED, sellerId: sellers[1].id },
        { type: DocumentType.LISTING_AGREEMENT, status: DocumentStatus.COMPLETED, sellerId: sellers[1].id },
        { type: DocumentType.QUESTIONNAIRE, status: DocumentStatus.COMPLETED, sellerId: sellers[1].id },
        { type: DocumentType.UPLOADED_DOC, status: DocumentStatus.COMPLETED, sellerId: sellers[1].id },
        { type: DocumentType.PURCHASE_AGREEMENT, status: DocumentStatus.PENDING, sellerId: sellers[1].id }
      ]
    })
  ]);

  // Create documents for seller3
  await Promise.all([
    prisma.document.createMany({
      data: [
        { type: DocumentType.EMAIL_AGENT, status: DocumentStatus.COMPLETED, sellerId: sellers[2].id },
        { type: DocumentType.LISTING_AGREEMENT, status: DocumentStatus.COMPLETED, sellerId: sellers[2].id },
        { type: DocumentType.QUESTIONNAIRE, status: DocumentStatus.PENDING, sellerId: sellers[2].id },
        { type: DocumentType.UPLOADED_DOC, status: DocumentStatus.PENDING, sellerId: sellers[2].id }
      ]
    })
  ]);

  // Create buyers
  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Ivy Buyer",
        email: "buyer1@example.com",
        password: "123456",
        role: UserRole.BUYER,
        managedBy: {
          connect: {
            id: agents[0].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Jack Buyer",
        email: "buyer2@example.com",
        password: "123456",
        role: UserRole.BUYER,
        managedBy: {
          connect: {
            id: agents[0].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Kelly Buyer",
        email: "buyer3@example.com",
        password: "123456",
        role: UserRole.BUYER,
        managedBy: {
          connect: {
            id: agents[1].id
          }
        }
      }
    })
  ]);

  // Create documents for buyer1
  await Promise.all([
    prisma.document.createMany({
      data: [
        { type: DocumentType.EMAIL_AGENT, status: DocumentStatus.COMPLETED, buyerId: buyers[0].id, sellerId: sellers[0].id },
        { type: DocumentType.NDA, status: DocumentStatus.COMPLETED, buyerId: buyers[0].id, sellerId: sellers[0].id },
        { type: DocumentType.FINANCIAL_STATEMENT, status: DocumentStatus.PENDING, buyerId: buyers[0].id, sellerId: sellers[0].id },
        { type: DocumentType.CBR_CIM, status: DocumentStatus.PENDING, buyerId: buyers[0].id, sellerId: sellers[0].id }
      ]
    })
  ]);

  // Create documents for buyer2
  await Promise.all([
    prisma.document.createMany({
      data: [
        { type: DocumentType.EMAIL_AGENT, status: DocumentStatus.COMPLETED, buyerId: buyers[1].id, sellerId: sellers[1].id },
        { type: DocumentType.NDA, status: DocumentStatus.COMPLETED, buyerId: buyers[1].id, sellerId: sellers[1].id },
        { type: DocumentType.FINANCIAL_STATEMENT, status: DocumentStatus.COMPLETED, buyerId: buyers[1].id, sellerId: sellers[1].id },
        { type: DocumentType.CBR_CIM, status: DocumentStatus.COMPLETED, buyerId: buyers[1].id, sellerId: sellers[1].id },
        { type: DocumentType.PURCHASE_CONTRACT, status: DocumentStatus.PENDING, buyerId: buyers[1].id, sellerId: sellers[1].id }
      ]
    })
  ]);

  // Create documents for buyer3
  await Promise.all([
    prisma.document.createMany({
      data: [
        { type: DocumentType.EMAIL_AGENT, status: DocumentStatus.COMPLETED, buyerId: buyers[2].id, sellerId: sellers[2].id },
        { type: DocumentType.NDA, status: DocumentStatus.COMPLETED, buyerId: buyers[2].id, sellerId: sellers[2].id },
        { type: DocumentType.FINANCIAL_STATEMENT, status: DocumentStatus.PENDING, buyerId: buyers[2].id, sellerId: sellers[2].id },
        { type: DocumentType.CBR_CIM, status: DocumentStatus.PENDING, buyerId: buyers[2].id, sellerId: sellers[2].id }
      ]
    })
  ]);

  // Create some test messages
  await prisma.message.create({
    data: {
      subject: "Welcome to the platform",
      content: "Hi, welcome to our business board platform!",
      senderId: broker.id,
      senderType: UserRole.BROKER,
      senderName: broker.name,
      receiverId: sellers[0].id,
      receiverType: UserRole.SELLER,
      receiverName: sellers[0].name
    }
  });

  await prisma.message.create({
    data: {
      subject: "Question about listing",
      content: "I'm interested in creating a new listing.",
      senderId: sellers[0].id,
      senderType: UserRole.SELLER,
      senderName: sellers[0].name,
      receiverId: broker.id,
      receiverType: UserRole.BROKER,
      receiverName: broker.name
    }
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .then(() => {
    console.log('✅ Preview seed data inserted!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });