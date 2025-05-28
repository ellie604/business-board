// seed.preview.ts
import { PrismaClient } from './generated/prisma-preview';
const prisma = new PrismaClient();

async function main() {
  // 创建 broker
  const broker = await prisma.broker.create({
    data: {
      name: 'Alice Broker',
      email: 'broker@example.com',
      password: '123456',
    },
  });

  // 创建 agents
  const agents = await Promise.all([
    prisma.user.create({
      data: {
        email: 'agent1@example.com',
        password: '123456',
        role: 'AGENT',
        brokerId: broker.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'agent2@example.com',
        password: '123456',
        role: 'AGENT',
        brokerId: broker.id,
      },
    }),
  ]);

  // 创建 sellers（添加了 seller3）
  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'seller1@example.com',
        password: '123456',
        role: 'SELLER',
        brokerId: broker.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'seller2@example.com',
        password: '123456',
        role: 'SELLER',
        brokerId: broker.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'seller3@example.com',
        password: '123456',
        role: 'SELLER',
        brokerId: broker.id,
      },
    }),
  ]);

  // 创建 buyers（添加了 buyer3）
  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'buyer1@example.com',
        password: '123456',
        role: 'BUYER',
        brokerId: broker.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'buyer2@example.com',
        password: '123456',
        role: 'BUYER',
        brokerId: broker.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'buyer3@example.com',
        password: '123456',
        role: 'BUYER',
        brokerId: broker.id,
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