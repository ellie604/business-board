// seed.preview.ts
import { PrismaClient, DocumentType, DocumentStatus, DocumentOperationType } from './generated/prisma-preview';
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

  // Create listings first (before creating documents that reference them)
  const listing1 = await prisma.listing.create({
    data: {
      title: "Yacht Sales",
      description: "Luxury yacht for sale.",
      price: 5000000,
      status: "ACTIVE",
      seller: { connect: { id: sellers[0].id } },
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      title: "Airplane Sales",
      description: "Private jet for sale.",
      price: 12000000,
      status: "UNDER_CONTRACT",
      seller: { connect: { id: sellers[1].id } },
    },
  });

  const listing3 = await prisma.listing.create({
    data: {
      title: "Coffee Shop",
      description: "Downtown coffee shop business.",
      price: 300000,
      status: "CLOSED",
      seller: { connect: { id: sellers[2].id } },
    },
  });

  // Create seller progress records
  await Promise.all([
    prisma.sellerProgress.create({
      data: {
        sellerId: sellers[0].id,
        currentStep: 2,
        completedSteps: [0, 1],
        selectedListingId: listing1.id
      }
    }),
    prisma.sellerProgress.create({
      data: {
        sellerId: sellers[1].id,
        currentStep: 4,
        completedSteps: [0, 1, 2, 3],
        selectedListingId: listing2.id
      }
    }),
    prisma.sellerProgress.create({
      data: {
        sellerId: sellers[2].id,
        currentStep: 1,
        completedSteps: [0],
        selectedListingId: listing3.id
      }
    })
  ]);

  // Create step-related documents for seller1 (steps 0,1 completed, step 2 in progress)
  await Promise.all([
    prisma.document.create({
      data: {
        type: DocumentType.EMAIL_AGENT,
        status: DocumentStatus.COMPLETED,
        sellerId: sellers[0].id,
        stepId: 0,
        listingId: listing1.id,
        operationType: DocumentOperationType.BOTH,
        fileName: "email_communication.txt",
        fileSize: 1024,
        uploadedAt: new Date('2024-01-01'),
        downloadedAt: new Date('2024-01-01')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.LISTING_AGREEMENT,
        status: DocumentStatus.COMPLETED,
        sellerId: sellers[0].id,
        stepId: 1,
        listingId: listing1.id,
        operationType: DocumentOperationType.DOWNLOAD,
        fileName: "listing_agreement.pdf",
        fileSize: 524288,
        downloadedAt: new Date('2024-01-02')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.QUESTIONNAIRE,
        status: DocumentStatus.PENDING,
        sellerId: sellers[0].id,
        stepId: 2,
        listingId: listing1.id,
        operationType: DocumentOperationType.UPLOAD,
        fileName: "business_questionnaire.pdf",
        fileSize: 0
      }
    })
  ]);

  // Create step-related documents for seller2 (steps 0,1,2,3 completed, step 4 in progress)
  await Promise.all([
    prisma.document.create({
      data: {
        type: DocumentType.EMAIL_AGENT,
        status: DocumentStatus.COMPLETED,
        sellerId: sellers[1].id,
        stepId: 0,
        listingId: listing2.id,
        operationType: DocumentOperationType.BOTH,
        fileName: "email_communication.txt",
        fileSize: 2048,
        uploadedAt: new Date('2024-01-03'),
        downloadedAt: new Date('2024-01-03')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.LISTING_AGREEMENT,
        status: DocumentStatus.COMPLETED,
        sellerId: sellers[1].id,
        stepId: 1,
        listingId: listing2.id,
        operationType: DocumentOperationType.DOWNLOAD,
        fileName: "listing_agreement.pdf",
        fileSize: 524288,
        downloadedAt: new Date('2024-01-04')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.QUESTIONNAIRE,
        status: DocumentStatus.COMPLETED,
        sellerId: sellers[1].id,
        stepId: 2,
        listingId: listing2.id,
        operationType: DocumentOperationType.UPLOAD,
        fileName: "business_questionnaire.pdf",
        fileSize: 102400,
        uploadedAt: new Date('2024-01-05')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.FINANCIAL_DOCUMENTS,
        status: DocumentStatus.COMPLETED,
        sellerId: sellers[1].id,
        stepId: 3,
        listingId: listing2.id,
        operationType: DocumentOperationType.UPLOAD,
        fileName: "financial_statements.pdf",
        fileSize: 1048576,
        uploadedAt: new Date('2024-01-06')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.UPLOADED_DOC,
        status: DocumentStatus.PENDING,
        sellerId: sellers[1].id,
        stepId: 4,
        listingId: listing2.id,
        operationType: DocumentOperationType.NONE
      }
    })
  ]);

  // Create step-related documents for seller3 (step 0 completed, step 1 in progress)
  await Promise.all([
    prisma.document.create({
      data: {
        type: DocumentType.EMAIL_AGENT,
        status: DocumentStatus.COMPLETED,
        sellerId: sellers[2].id,
        stepId: 0,
        listingId: listing3.id,
        operationType: DocumentOperationType.BOTH,
        fileName: "email_communication.txt",
        fileSize: 512,
        uploadedAt: new Date('2024-01-07'),
        downloadedAt: new Date('2024-01-07')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.LISTING_AGREEMENT,
        status: DocumentStatus.PENDING,
        sellerId: sellers[2].id,
        stepId: 1,
        listingId: listing3.id,
        operationType: DocumentOperationType.DOWNLOAD,
        fileName: "listing_agreement.pdf",
        fileSize: 0
      }
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

  // Update listings to connect buyers
  await prisma.listing.update({
    where: { id: listing1.id },
    data: {
      buyers: { connect: [{ id: buyers[0].id }, { id: buyers[1].id }] }
    }
  });

  await prisma.listing.update({
    where: { id: listing2.id },
    data: {
      buyers: { connect: [{ id: buyers[2].id }] }
    }
  });

  // Create documents for buyer1
  await Promise.all([
    prisma.document.create({
      data: {
        type: DocumentType.EMAIL_AGENT,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[0].id,
        sellerId: sellers[0].id,
        operationType: DocumentOperationType.BOTH,
        fileName: "buyer_email_communication.txt",
        fileSize: 1024
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.NDA,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[0].id,
        sellerId: sellers[0].id,
        operationType: DocumentOperationType.DOWNLOAD,
        fileName: "nda_agreement.pdf",
        fileSize: 204800,
        downloadedAt: new Date('2024-01-08')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.FINANCIAL_STATEMENT,
        status: DocumentStatus.PENDING,
        buyerId: buyers[0].id,
        sellerId: sellers[0].id,
        operationType: DocumentOperationType.UPLOAD
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.CBR_CIM,
        status: DocumentStatus.PENDING,
        buyerId: buyers[0].id,
        sellerId: sellers[0].id,
        operationType: DocumentOperationType.DOWNLOAD
      }
    })
  ]);

  // Create documents for buyer2
  await Promise.all([
    prisma.document.create({
      data: {
        type: DocumentType.EMAIL_AGENT,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[1].id,
        sellerId: sellers[1].id,
        operationType: DocumentOperationType.BOTH,
        fileName: "buyer_email_communication.txt",
        fileSize: 2048
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.NDA,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[1].id,
        sellerId: sellers[1].id,
        operationType: DocumentOperationType.DOWNLOAD,
        fileName: "nda_agreement.pdf",
        fileSize: 204800,
        downloadedAt: new Date('2024-01-09')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.FINANCIAL_STATEMENT,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[1].id,
        sellerId: sellers[1].id,
        operationType: DocumentOperationType.UPLOAD,
        fileName: "buyer_financial_statement.pdf",
        fileSize: 512000,
        uploadedAt: new Date('2024-01-10')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.CBR_CIM,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[1].id,
        sellerId: sellers[1].id,
        operationType: DocumentOperationType.DOWNLOAD,
        fileName: "cbr_cim.pdf",
        fileSize: 1024000,
        downloadedAt: new Date('2024-01-11')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.PURCHASE_CONTRACT,
        status: DocumentStatus.PENDING,
        buyerId: buyers[1].id,
        sellerId: sellers[1].id,
        operationType: DocumentOperationType.UPLOAD
      }
    })
  ]);

  // Create documents for buyer3
  await Promise.all([
    prisma.document.create({
      data: {
        type: DocumentType.EMAIL_AGENT,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[2].id,
        sellerId: sellers[2].id,
        operationType: DocumentOperationType.BOTH,
        fileName: "buyer_email_communication.txt",
        fileSize: 1536
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.NDA,
        status: DocumentStatus.COMPLETED,
        buyerId: buyers[2].id,
        sellerId: sellers[2].id,
        operationType: DocumentOperationType.DOWNLOAD,
        fileName: "nda_agreement.pdf",
        fileSize: 204800,
        downloadedAt: new Date('2024-01-12')
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.FINANCIAL_STATEMENT,
        status: DocumentStatus.PENDING,
        buyerId: buyers[2].id,
        sellerId: sellers[2].id,
        operationType: DocumentOperationType.UPLOAD
      }
    }),
    prisma.document.create({
      data: {
        type: DocumentType.CBR_CIM,
        status: DocumentStatus.PENDING,
        buyerId: buyers[2].id,
        sellerId: sellers[2].id,
        operationType: DocumentOperationType.DOWNLOAD
      }
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