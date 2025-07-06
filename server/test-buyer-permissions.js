const { PrismaClient } = require('./generated/prisma-production');

const prisma = new PrismaClient();

async function testBuyerPermissions() {
  try {
    console.log('Testing buyer permissions...\n');
    
    // 获取Nick Buyer的信息
    const nickBuyer = await prisma.user.findFirst({
      where: { 
        email: { contains: 'buyer5' },
        role: 'BUYER'
      }
    });
    
    if (!nickBuyer) {
      console.log('Nick Buyer not found');
      return;
    }
    
    console.log('Nick Buyer found:', {
      id: nickBuyer.id,
      email: nickBuyer.email,
      name: nickBuyer.name,
      managerId: nickBuyer.managerId
    });
    
    // 获取Nick的buyer progress和选中的listing
    const buyerProgress = await prisma.buyerProgress.findFirst({
      where: { buyerId: nickBuyer.id },
      include: {
        selectedListing: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
                managerId: true,
                managedBy: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    console.log('\nNick\'s buyer progress:');
    if (buyerProgress) {
      console.log('Selected listing:', buyerProgress.selectedListing?.title || 'None');
      if (buyerProgress.selectedListing?.seller) {
        console.log('Listing seller:', {
          name: buyerProgress.selectedListing.seller.name,
          email: buyerProgress.selectedListing.seller.email,
          managerId: buyerProgress.selectedListing.seller.managerId,
          managedBy: buyerProgress.selectedListing.seller.managedBy
        });
      }
    } else {
      console.log('No buyer progress found');
    }
    
    // 测试权限控制逻辑
    const listingAgentId = buyerProgress?.selectedListing?.seller?.managerId;
    
    console.log('\nPermission check:');
    console.log('Nick\'s managerId:', nickBuyer.managerId);
    console.log('Listing agent ID:', listingAgentId);
    
    // 模拟权限查询
    const whereCondition = {
      AND: [
        {
          NOT: {
            id: nickBuyer.id
          }
        },
        {
          isActive: true
        },
        {
          OR: [
            // 可以联系所有 BROKER
            { role: 'BROKER' },
            // 可以联系管理自己的 AGENT（如果有的话）
            ...(nickBuyer.managerId ? [{ id: nickBuyer.managerId }] : []),
            // 可以联系管理其选中listing的 AGENT
            ...(listingAgentId ? [{ id: listingAgentId }] : [])
          ]
        }
      ]
    };
    
    const availableContacts = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: {
        role: 'asc'
      }
    });
    
    console.log('\nAvailable contacts for Nick Buyer:');
    availableContacts.forEach(contact => {
      console.log(`- ${contact.name} (${contact.email}) - ${contact.role}`);
    });
    
    // 检查Downtown Coffee Shop的具体信息
    const coffeeShop = await prisma.listing.findFirst({
      where: {
        title: { contains: 'Downtown Coffee Shop' }
      },
      include: {
        seller: {
          include: {
            managedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });
    
    console.log('\nDowntown Coffee Shop details:');
    if (coffeeShop) {
      console.log('Title:', coffeeShop.title);
      console.log('Seller:', {
        name: coffeeShop.seller.name,
        email: coffeeShop.seller.email,
        managedBy: coffeeShop.seller.managedBy
      });
    } else {
      console.log('Downtown Coffee Shop not found');
    }
    
  } catch (error) {
    console.error('Error testing buyer permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBuyerPermissions(); 