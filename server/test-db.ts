import { getPrisma, disconnectPrisma } from './database';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    console.log('Environment:', process.env.NODE_ENV);
    
    const prisma = getPrisma();
    
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
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await disconnectPrisma();
  }
}

testDatabase(); 