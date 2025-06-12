const fs = require('fs');
const path = require('path');

// Function to create a simple PDF content
function createPDFContent(title, content) {
  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${200 + content.length} >>
stream
BT
/F1 16 Tf
50 750 Td
(${title}) Tj
0 -30 Td
/F1 12 Tf
${content}
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000079 00000 n
0000000173 00000 n
0000000301 00000 n
0000000380 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${600 + content.length}
%%EOF`;
}

// Document types and their content
const documents = [
  {
    type: 'LISTING_AGREEMENT',
    filename: 'Listing_Agreement.pdf',
    title: 'BUSINESS LISTING AGREEMENT',
    content: `(This agreement is between the business owner (Seller) and the broker.) Tj
0 -20 Td
(The seller agrees to list their business for sale through the broker.) Tj
0 -20 Td
(Commission: 10% of final sale price) Tj
0 -20 Td
(Listing Period: 6 months from date of signing) Tj
0 -20 Td
(Marketing: Broker will market through multiple channels) Tj
0 -20 Td
(Confidentiality: All business information will be kept confidential) Tj
0 -20 Td
(Date: ${new Date().toLocaleDateString()}) Tj
0 -20 Td
(Broker Signature: ________________) Tj
0 -20 Td
(Seller Signature: ________________) Tj`
  },
  {
    type: 'QUESTIONNAIRE',
    filename: 'Business_Questionnaire.pdf',
    title: 'BUSINESS INFORMATION QUESTIONNAIRE',
    content: `(Please provide detailed information about your business:) Tj
0 -20 Td
(1. Business Name: ________________________________) Tj
0 -20 Td
(2. Years in Operation: ____________________________) Tj
0 -20 Td
(3. Number of Employees: ___________________________) Tj
0 -20 Td
(4. Annual Revenue: ________________________________) Tj
0 -20 Td
(5. Reason for Sale: _______________________________) Tj
0 -20 Td
(6. Assets Included: _______________________________) Tj
0 -20 Td
(7. Lease Information: _____________________________) Tj
0 -20 Td
(8. Equipment Condition: ___________________________) Tj
0 -20 Td
(9. Customer Base: _________________________________) Tj`
  },
  {
    type: 'PURCHASE_CONTRACT',
    filename: 'Purchase_Contract.pdf',
    title: 'BUSINESS PURCHASE CONTRACT',
    content: `(PURCHASE AGREEMENT FOR BUSINESS SALE) Tj
0 -20 Td
(Buyer: ___________________________________________) Tj
0 -20 Td
(Seller: __________________________________________) Tj
0 -20 Td
(Business: ________________________________________) Tj
0 -20 Td
(Purchase Price: $__________________________________) Tj
0 -20 Td
(Down Payment: $___________________________________) Tj
0 -20 Td
(Financing Terms: __________________________________) Tj
0 -20 Td
(Closing Date: _____________________________________) Tj
0 -20 Td
(Assets Included: __________________________________) Tj
0 -20 Td
(Contingencies: ____________________________________) Tj`
  },
  {
    type: 'CLOSING_DOCS',
    filename: 'Closing_Documents.pdf',
    title: 'BUSINESS SALE CLOSING DOCUMENTS',
    content: `(CLOSING CHECKLIST AND DOCUMENTS) Tj
0 -20 Td
(□ Final Purchase Agreement signed) Tj
0 -20 Td
(□ Bill of Sale executed) Tj
0 -20 Td
(□ Asset Transfer completed) Tj
0 -20 Td
(□ Lease Assignment (if applicable)) Tj
0 -20 Td
(□ Employee Notifications sent) Tj
0 -20 Td
(□ Vendor/Supplier notifications) Tj
0 -20 Td
(□ Bank account transfers) Tj
0 -20 Td
(□ Insurance policy transfers) Tj
0 -20 Td
(□ Final walk-through completed) Tj
0 -20 Td
(Closing Date: ${new Date().toLocaleDateString()}) Tj`
  },
  {
    type: 'NDA',
    filename: 'Non_Disclosure_Agreement.pdf',
    title: 'NON-DISCLOSURE AGREEMENT',
    content: `(CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT) Tj
0 -20 Td
(This agreement protects confidential business information.) Tj
0 -20 Td
(Recipient agrees to keep all business information confidential.) Tj
0 -20 Td
(Information includes but not limited to:) Tj
0 -20 Td
(- Financial statements and records) Tj
0 -20 Td
(- Customer lists and relationships) Tj
0 -20 Td
(- Vendor and supplier information) Tj
0 -20 Td
(- Business processes and procedures) Tj
0 -20 Td
(- Trade secrets and proprietary information) Tj
0 -20 Td
(Term: 2 years from date of signing) Tj
0 -20 Td
(Violations subject to legal action) Tj`
  },
  {
    type: 'FINANCIAL_STATEMENT',
    filename: 'Financial_Statement_Template.pdf',
    title: 'BUSINESS FINANCIAL STATEMENT',
    content: `(FINANCIAL INFORMATION SUMMARY) Tj
0 -20 Td
(Revenue (Last 3 Years):) Tj
0 -20 Td
(Year 1: $__________________) Tj
0 -20 Td
(Year 2: $__________________) Tj
0 -20 Td
(Year 3: $__________________) Tj
0 -20 Td
(Operating Expenses:) Tj
0 -20 Td
(Rent: $___________________) Tj
0 -20 Td
(Payroll: $_________________) Tj
0 -20 Td
(Utilities: $________________) Tj
0 -20 Td
(Other: $___________________) Tj
0 -20 Td
(Net Profit: $_______________) Tj`
  },
  {
    type: 'CBR_CIM',
    filename: 'CBR_CIM_Document.pdf',
    title: 'CONFIDENTIAL BUSINESS REVIEW (CIM)',
    content: `(CONFIDENTIAL INFORMATION MEMORANDUM) Tj
0 -20 Td
(Executive Summary:) Tj
0 -20 Td
(This document provides an overview of the business opportunity.) Tj
0 -20 Td
(Business Overview:) Tj
0 -20 Td
(- Industry sector and market position) Tj
0 -20 Td
(- Competitive advantages) Tj
0 -20 Td
(- Growth opportunities) Tj
0 -20 Td
(Financial Highlights:) Tj
0 -20 Td
(- Revenue trends and projections) Tj
0 -20 Td
(- Profitability analysis) Tj
0 -20 Td
(Investment Highlights:) Tj
0 -20 Td
(- Strategic value proposition) Tj`
  },
  {
    type: 'DUE_DILIGENCE',
    filename: 'Due_Diligence_Checklist.pdf',
    title: 'DUE DILIGENCE CHECKLIST',
    content: `(DUE DILIGENCE REQUIREMENTS) Tj
0 -20 Td
(Financial Documentation:) Tj
0 -20 Td
(□ 3 years of tax returns) Tj
0 -20 Td
(□ Profit & Loss statements) Tj
0 -20 Td
(□ Balance sheets) Tj
0 -20 Td
(□ Cash flow statements) Tj
0 -20 Td
(Legal Documentation:) Tj
0 -20 Td
(□ Articles of incorporation) Tj
0 -20 Td
(□ Operating agreements) Tj
0 -20 Td
(□ Material contracts) Tj
0 -20 Td
(□ Lease agreements) Tj
0 -20 Td
(□ Insurance policies) Tj`
  }
];

// Create test-pdfs directory
const outputDir = path.join(__dirname, 'test-pdfs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate PDF files
documents.forEach(doc => {
  const pdfContent = createPDFContent(doc.title, doc.content);
  const filepath = path.join(outputDir, doc.filename);
  
  fs.writeFileSync(filepath, pdfContent);
  console.log(`✅ Generated: ${doc.filename} (${doc.type})`);
});

console.log(`\n🎉 All test PDF files generated in: ${outputDir}`);
console.log('\nYou can now use these files to test broker document uploads!'); 