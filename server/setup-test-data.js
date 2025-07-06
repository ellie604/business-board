const { PrismaClient } = require('./generated/prisma-production');

const prisma = new PrismaClient();

async function setupTestData() {
  try {
    console.log('Setting up test data...');
    
    // 首先获取现有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        managerId: true
      }
    });
    
    console.log('Current users:', users);
    
    // 找到第一个agent、第一个seller和第一个buyer
    const agent = users.find(u => u.role === 'AGENT');
    const seller = users.find(u => u.role === 'SELLER');
    const buyer = users.find(u => u.role === 'BUYER');
    
    if (agent && seller && !seller.managerId) {
      console.log(`Setting agent ${agent.email} as manager of seller ${seller.email}`);
      await prisma.user.update({
        where: { id: seller.id },
        data: { managerId: agent.id }
      });
    }
    
    if (agent && buyer && !buyer.managerId) {
      console.log(`Setting agent ${agent.email} as manager of buyer ${buyer.email}`);
      await prisma.user.update({
        where: { id: buyer.id },
        data: { managerId: agent.id }
      });
    }
    
    // 显示更新后的数据
    const updatedUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        managerId: true
      }
    });
    
    console.log('Updated users:', updatedUsers);
    console.log('Test data setup complete!');
    
  } catch (error) {
    console.error('Error setting up test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestData(); 