// seed.production.ts
import { PrismaClient } from './generated/prisma-production';
import { getPrisma } from './database';
import { UserRole } from './generated/prisma-production';
import { createClient } from '@supabase/supabase-js';

const prisma = getPrisma();

// Supabase configuration for storage cleanup
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const getStorageBucket = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? 'business-documents-prod' : 'business-documents-dev';
};

async function clearSupabaseStorage() {
  try {
    console.log('🧹 Clearing Supabase Storage...');
    
    // Try both old and new bucket names
    const possibleBuckets = ['message-attachments-prod', 'business-documents-prod'];
    
    for (const bucketName of possibleBuckets) {
      console.log(`   Checking bucket: ${bucketName}`);
      
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });
      
      if (listError) {
        console.log(`   - Bucket ${bucketName} not found or error:`, listError.message);
        continue;
      }
      
      if (files && files.length > 0) {
        console.log(`   - Found ${files.length} items in ${bucketName}`);
        
        // Get all file paths (including folders)
        const allPaths: string[] = [];
        
        // Add individual files
        files.forEach(file => {
          if (file.name && !file.name.endsWith('/')) {
            allPaths.push(file.name);
          }
        });
        
        // List files in folders recursively
        for (const item of files) {
          if (item.name && item.name.endsWith('/')) {
            const { data: folderFiles } = await supabase.storage
              .from(bucketName)
              .list(item.name, { limit: 1000 });
            
            if (folderFiles) {
              folderFiles.forEach(file => {
                if (file.name) {
                  allPaths.push(`${item.name}${file.name}`);
                }
              });
            }
          }
        }
        
        // Also check for nested folders (legacy and new structure)
        const commonFolders = [
          'agent-docs', 'broker-docs', 'seller-docs', 'buyer-docs', 
          'questionnaires', 'messages', 'communications', 'listings'
        ];
        
        for (const folder of commonFolders) {
          const { data: folderFiles } = await supabase.storage
            .from(bucketName)
            .list(folder, { limit: 1000 });
          
          if (folderFiles) {
            for (const file of folderFiles) {
              if (file.name) {
                allPaths.push(`${folder}/${file.name}`);
                
                // Check for nested folders within these folders
                if (file.name.endsWith('/')) {
                  const { data: nestedFiles } = await supabase.storage
                    .from(bucketName)
                    .list(`${folder}/${file.name}`, { limit: 1000 });
                  
                  if (nestedFiles) {
                    nestedFiles.forEach(nestedFile => {
                      if (nestedFile.name) {
                        allPaths.push(`${folder}/${file.name}${nestedFile.name}`);
                      }
                    });
                  }
                }
              }
            }
          }
        }
        
        console.log(`   - Found ${allPaths.length} files to delete from ${bucketName}`);
        
        if (allPaths.length > 0) {
          // Delete files in batches to avoid timeout
          const batchSize = 100;
          for (let i = 0; i < allPaths.length; i += batchSize) {
            const batch = allPaths.slice(i, i + batchSize);
            const { error: deleteError } = await supabase.storage
              .from(bucketName)
              .remove(batch);
            
            if (deleteError) {
              console.error(`Error deleting batch ${i / batchSize + 1} from ${bucketName}:`, deleteError);
            } else {
              console.log(`   - Deleted batch ${i / batchSize + 1}/${Math.ceil(allPaths.length / batchSize)} from ${bucketName} (${batch.length} files)`);
            }
          }
          console.log(`   - Successfully deleted all ${allPaths.length} files from ${bucketName}`);
        }
      } else {
        console.log(`   - No files found in ${bucketName}`);
      }
    }
    
    console.log('✅ Supabase Storage cleared successfully!');
    console.log('\n📁 Ready for new file organization structure:');
    console.log('   listings/{listingId}/seller/documents/     - Seller documents');
    console.log('   listings/{listingId}/seller/questionnaire.pdf - Seller questionnaire');
    console.log('   listings/{listingId}/buyer/documents/      - Buyer documents');
    console.log('   listings/{listingId}/broker/documents/     - Broker documents');
    console.log('   listings/{listingId}/agent/documents/      - Agent documents');
    console.log('   communications/attachments/                - Message attachments');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error clearing Supabase Storage:', error);
  }
}

async function main() {
  // Clear Supabase Storage first
  await clearSupabaseStorage();
  
  console.log('🌱 Starting database seeding...');
  
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

  // Create buyer progress records - ALL START AT STEP 0 with no progress and no selected listing
  await Promise.all(
    buyers.map(buyer => 
      prisma.buyerProgress.create({
        data: {
          buyerId: buyer.id,
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
  console.log(`- All buyers start at step 0 with no progress and no selected listing`);
  console.log(`- NO documents created - clean slate for testing uploads/downloads`);
  console.log(`- NO pre-close checklists created - all items will be unchecked by default when first accessed`);
}

main()
  .then(() => {
    console.log('✅ Production seed data inserted!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });