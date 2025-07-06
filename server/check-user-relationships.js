const { PrismaClient } = require('./generated/prisma-production');

const prisma = new PrismaClient();

async function checkUserRelationships() {
  try {
    console.log('Checking user relationships...');
    
    // 获取所有用户及其管理关系
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        managerId: true,
        managedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        managing: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      }
    });
    
    console.log('All users with relationships:');
    users.forEach(user => {
      console.log(`\n${user.name} (${user.email}) - ${user.role}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Manager ID: ${user.managerId || 'None'}`);
      
      if (user.managedBy) {
        console.log(`  Managed by: ${user.managedBy.name} (${user.managedBy.email}) - ${user.managedBy.role}`);
      }
      
      if (user.managing && user.managing.length > 0) {
        console.log(`  Managing:`);
        user.managing.forEach(managed => {
          console.log(`    - ${managed.name} (${managed.email}) - ${managed.role}`);
        });
      }
    });
    
    // 特别检查Frank Seller和David Agent的关系
    const frank = users.find(u => u.email.toLowerCase().includes('frank') && u.role === 'SELLER');
    const david = users.find(u => u.email.toLowerCase().includes('david') && u.role === 'AGENT');
    
    if (frank && david) {
      console.log('\n=== Frank Seller and David Agent Relationship Check ===');
      console.log('Frank Seller:', {
        id: frank.id,
        email: frank.email,
        managerId: frank.managerId,
        managedBy: frank.managedBy
      });
      console.log('David Agent:', {
        id: david.id,
        email: david.email,
        managing: david.managing
      });
      
      console.log(`Frank should be managed by David: ${frank.managerId === david.id ? 'YES' : 'NO'}`);
      console.log(`David manages Frank: ${david.managing.some(m => m.id === frank.id) ? 'YES' : 'NO'}`);
    }
    
  } catch (error) {
    console.error('Error checking user relationships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRelationships(); 