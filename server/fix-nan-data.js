const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixNaNData() {
  console.log('🔧 Starting to fix NaN and invalid data in database...');

  try {
    // 1. 修复NaN文件大小
    const documentsWithNaNSize = await prisma.document.findMany({
      where: {
        OR: [
          { fileSize: null },
          { fileSize: 0 },
          // Note: Prisma doesn't directly support NaN queries, so we'll update all null/0 sizes
        ]
      }
    });

    console.log(`Found ${documentsWithNaNSize.length} documents with invalid file sizes`);

    for (const doc of documentsWithNaNSize) {
      // 给默认大小基于文件类型
      let defaultSize = 1024; // 1KB default
      
      if (doc.type === 'NDA') defaultSize = 1200; // 1.2KB for NDA
      if (doc.type === 'FINANCIAL_STATEMENT') defaultSize = 2048; // 2KB
      if (doc.type === 'LISTING_AGREEMENT') defaultSize = 1500; // 1.5KB
      if (doc.type === 'PURCHASE_AGREEMENT') defaultSize = 1800; // 1.8KB

      await prisma.document.update({
        where: { id: doc.id },
        data: { 
          fileSize: defaultSize,
          // 确保文件名存在
          fileName: doc.fileName || `${doc.type}_Document.pdf`
        }
      });

      console.log(`✅ Fixed document ${doc.id}: ${doc.type} - ${doc.fileName || 'unnamed'}`);
    }

    // 2. 修复缺失的文件名
    const documentsWithoutName = await prisma.document.findMany({
      where: {
        OR: [
          { fileName: null },
          { fileName: '' }
        ]
      }
    });

    console.log(`Found ${documentsWithoutName.length} documents without file names`);

    for (const doc of documentsWithoutName) {
      let defaultFileName = 'Document.pdf';
      
      switch (doc.type) {
        case 'NDA':
          defaultFileName = 'Non_Disclosure_Agreement.pdf';
          break;
        case 'FINANCIAL_STATEMENT':
          defaultFileName = 'Financial_Statement.pdf';
          break;
        case 'LISTING_AGREEMENT':
          defaultFileName = 'Listing_Agreement.pdf';
          break;
        case 'PURCHASE_AGREEMENT':
          defaultFileName = 'Purchase_Agreement.pdf';
          break;
        case 'CBR_CIM':
          defaultFileName = 'CBR_CIM_Document.pdf';
          break;
        case 'DUE_DILIGENCE':
          defaultFileName = 'Due_Diligence_Checklist.pdf';
          break;
        case 'PURCHASE_CONTRACT':
          defaultFileName = 'Purchase_Contract.pdf';
          break;
        default:
          defaultFileName = `${doc.type}_Document.pdf`;
      }

      await prisma.document.update({
        where: { id: doc.id },
        data: { fileName: defaultFileName }
      });

      console.log(`✅ Fixed file name for document ${doc.id}: ${defaultFileName}`);
    }

    // 3. 修复创建时间为1970年的记录
    const documentsWithInvalidDate = await prisma.document.findMany({
      where: {
        createdAt: {
          lt: new Date('2020-01-01') // 2020年之前的都认为是无效的
        }
      }
    });

    console.log(`Found ${documentsWithInvalidDate.length} documents with invalid dates`);

    for (const doc of documentsWithInvalidDate) {
      await prisma.document.update({
        where: { id: doc.id },
        data: { 
          createdAt: new Date(),
          uploadedAt: new Date()
        }
      });

      console.log(`✅ Fixed dates for document ${doc.id}`);
    }

    console.log('🎉 Data cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during data cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行修复脚本
fixNaNData(); 