const { PrismaClient } = require('./generated/prisma-production');

const prisma = new PrismaClient();

async function checkNickBuyerStatus() {
  try {
    console.log('Checking Nick Buyer status...\n');
    
    // 获取Nick Buyer
    const nickBuyer = await prisma.user.findFirst({
      where: { 
        name: 'Nick Buyer',
        role: 'BUYER'
      }
    });
    
    if (!nickBuyer) {
      console.log('Nick Buyer not found');
      return;
    }
    
    console.log('Nick Buyer:', {
      id: nickBuyer.id,
      email: nickBuyer.email,
      managerId: nickBuyer.managerId
    });
    
    // 获取Nick的所有buyer progress记录
    const allProgress = await prisma.buyerProgress.findMany({
      where: { buyerId: nickBuyer.id },
      include: {
        selectedListing: {
          include: {
            seller: {
              select: {
                name: true,
                managerId: true,
                managedBy: {
                  select: {
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
    
    console.log('\nAll buyer progress records for Nick:');
    allProgress.forEach((progress, index) => {
      console.log(`Record ${index + 1}:`, {
        id: progress.id,
        selectedListingId: progress.selectedListingId,
        selectedListingTitle: progress.selectedListing?.title,
        currentStep: progress.currentStep,
        completedSteps: progress.completedSteps,
        seller: progress.selectedListing?.seller?.name,
        listingAgent: progress.selectedListing?.seller?.managedBy?.name
      });
    });
    
    // 检查Nick对哪些listings感兴趣
    const interestedListings = await prisma.listing.findMany({
      where: {
        buyers: {
          some: {
            id: nickBuyer.id
          }
        }
      },
      include: {
        seller: {
          select: {
            name: true,
            managerId: true,
            managedBy: {
              select: {
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });
    
    console.log('\nListings Nick is interested in:');
    interestedListings.forEach(listing => {
      console.log(`- ${listing.title}`, {
        seller: listing.seller.name,
        agent: listing.seller.managedBy?.name || 'No agent'
      });
    });
    
    // 检查所有listings的agent分配情况
    console.log('\nAll listings and their agents:');
    const allListings = await prisma.listing.findMany({
      include: {
        seller: {
          select: {
            name: true,
            managedBy: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    allListings.forEach(listing => {
      console.log(`${listing.title}: ${listing.seller.name} -> ${listing.seller.managedBy?.name || 'No agent'}`);
    });
    
  } catch (error) {
    console.error('Error checking Nick Buyer status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNickBuyerStatus(); 