// seed.preview.ts
import { PrismaClient } from './generated/prisma-preview';
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
    }),
    prisma.user.create({
      data: {
        name: "Sarah Agent",
        email: "agent3@example.com",
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

  // Create more sellers
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
    }),
    prisma.user.create({
      data: {
        name: "Isabella Seller",
        email: "seller4@example.com",
        password: "123456",
        role: UserRole.SELLER,
        managedBy: {
          connect: {
            id: agents[1].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "James Seller",
        email: "seller5@example.com",
        password: "123456",
        role: UserRole.SELLER,
        managedBy: {
          connect: {
            id: agents[2].id
          }
        }
      }
    })
  ]);

  // Create more buyers
  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Buyer",
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
        name: "Kate Buyer",
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
        name: "Leo Buyer",
        email: "buyer3@example.com",
        password: "123456",
        role: UserRole.BUYER,
        managedBy: {
          connect: {
            id: agents[1].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Maria Buyer",
        email: "buyer4@example.com",
        password: "123456",
        role: UserRole.BUYER,
        managedBy: {
          connect: {
            id: agents[1].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Nick Buyer",
        email: "buyer5@example.com",
        password: "123456",
        role: UserRole.BUYER,
        managedBy: {
          connect: {
            id: agents[2].id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: "Olivia Buyer",
        email: "buyer6@example.com",
        password: "123456",
        role: UserRole.BUYER,
        managedBy: {
          connect: {
            id: agents[2].id
          }
        }
      }
    })
  ]);

  // Create diverse listings with different buyer scenarios
  const listings = await Promise.all([
    // Listing 1: Frank's Yacht Sales (1 seller, 1 buyer)
    prisma.listing.create({
      data: {
        title: "Luxury Yacht Sales Business",
        description: "Established yacht sales company with marina access.",
        price: 5000000,
        status: "ACTIVE",
        seller: { connect: { id: sellers[0].id } },
      },
    }),
    // Listing 2: Grace's Airplane Sales (1 seller, multiple buyers)
    prisma.listing.create({
      data: {
        title: "Private Jet Sales Business",
        description: "High-end aircraft sales and maintenance company.",
        price: 12000000,
        status: "UNDER_CONTRACT",
        seller: { connect: { id: sellers[1].id } },
      },
    }),
    // Listing 3: Henry's Coffee Shop (1 seller, no buyers yet)
    prisma.listing.create({
      data: {
        title: "Downtown Coffee Shop",
        description: "Busy coffee shop in prime downtown location.",
        price: 300000,
        status: "ACTIVE",
        seller: { connect: { id: sellers[2].id } },
      },
    }),
    // Listing 4: Isabella's Restaurant (1 seller, 1 buyer)
    prisma.listing.create({
      data: {
        title: "Italian Restaurant",
        description: "Family-owned Italian restaurant with loyal customer base.",
        price: 750000,
        status: "ACTIVE",
        seller: { connect: { id: sellers[3].id } },
      },
    }),
    // Listing 5: James's Tech Startup (1 seller, multiple buyers)
    prisma.listing.create({
      data: {
        title: "Software Development Company",
        description: "Growing tech startup with proprietary software products.",
        price: 2500000,
        status: "ACTIVE",
        seller: { connect: { id: sellers[4].id } },
      },
    }),
    // Additional listings for same sellers
    // Frank's second business
    prisma.listing.create({
      data: {
        title: "Marine Equipment Store",
        description: "Retail store selling marine equipment and accessories.",
        price: 800000,
        status: "ACTIVE",
        seller: { connect: { id: sellers[0].id } },
      },
    }),
    // Grace's second business
    prisma.listing.create({
      data: {
        title: "Aviation Training School",
        description: "Flight training academy with certified instructors.",
        price: 1500000,
        status: "ACTIVE",
        seller: { connect: { id: sellers[1].id } },
      },
    })
  ]);

  // Connect buyers to listings with different scenarios
  await Promise.all([
    // Listing 1: 1 buyer
    prisma.listing.update({
      where: { id: listings[0].id },
      data: { buyers: { connect: [{ id: buyers[0].id }] } }
    }),
    // Listing 2: Multiple buyers
    prisma.listing.update({
      where: { id: listings[1].id },
      data: { buyers: { connect: [{ id: buyers[1].id }, { id: buyers[2].id }, { id: buyers[3].id }] } }
    }),
    // Listing 3: No buyers (Henry's coffee shop)
    // Listing 4: 1 buyer
    prisma.listing.update({
      where: { id: listings[3].id },
      data: { buyers: { connect: [{ id: buyers[4].id }] } }
    }),
    // Listing 5: Multiple buyers
    prisma.listing.update({
      where: { id: listings[4].id },
      data: { buyers: { connect: [{ id: buyers[0].id }, { id: buyers[5].id }] } }
    }),
    // Listing 6: 1 buyer
    prisma.listing.update({
      where: { id: listings[5].id },
      data: { buyers: { connect: [{ id: buyers[1].id }] } }
    }),
    // Listing 7: No buyers yet
  ]);

  // Create seller progress records - ALL START AT STEP 0 with no progress and no selected listing
  await Promise.all(
    sellers.map(seller => 
      prisma.sellerProgress.create({
        data: {
          sellerId: seller.id,
          currentStep: 0,          // Everyone starts at step 0
          completedSteps: [],      // No steps completed initially
          selectedListingId: null  // No listing selected initially - user must select
        }
      })
    )
  );

  // Create some test messages (but no documents)
  await prisma.message.create({
    data: {
      subject: "Welcome to the platform",
      content: "Hi, welcome to our business sales platform!",
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
      content: "I'm interested in learning more about the process.",
      senderId: sellers[1].id,
      senderType: UserRole.SELLER,
      senderName: sellers[1].name,
      receiverId: agents[0].id,
      receiverType: UserRole.AGENT,
      receiverName: agents[0].name
    }
  });

  console.log('Database has been seeded. 🌱');
  console.log('Created:');
  console.log(`- 1 Broker: ${broker.name}`);
  console.log(`- 3 Agents: ${agents.map(a => a.name).join(', ')}`);
  console.log(`- 5 Sellers: ${sellers.map(s => s.name).join(', ')}`);
  console.log(`- 6 Buyers: ${buyers.map(b => b.name).join(', ')}`);
  console.log(`- 7 Listings with different buyer scenarios`);
  console.log(`- All sellers start at step 0 with no progress and no selected listing`);
  console.log(`- NO documents created - clean slate for testing uploads/downloads`);
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