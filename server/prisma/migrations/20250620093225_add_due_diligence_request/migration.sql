/*
  Warnings:

  - You are about to drop the column `brokerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Broker` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sellerId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DocumentOperationType" AS ENUM ('UPLOAD', 'DOWNLOAD', 'BOTH', 'NONE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('SELLER_UPLOAD', 'AGENT_PROVIDED', 'BUYER_UPLOAD', 'SYSTEM_GENERATED');

-- CreateEnum
CREATE TYPE "DueDiligenceStatus" AS ENUM ('REQUESTED', 'FULFILLED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'EMAIL_AGENT';
ALTER TYPE "DocumentType" ADD VALUE 'UPLOADED_DOC';
ALTER TYPE "DocumentType" ADD VALUE 'PURCHASE_AGREEMENT';
ALTER TYPE "DocumentType" ADD VALUE 'DUE_DILIGENCE';
ALTER TYPE "DocumentType" ADD VALUE 'PRE_CLOSE_CHECKLIST';
ALTER TYPE "DocumentType" ADD VALUE 'CLOSING_DOCS';
ALTER TYPE "DocumentType" ADD VALUE 'CBR_CIM';
ALTER TYPE "DocumentType" ADD VALUE 'QUESTIONNAIRE';
ALTER TYPE "DocumentType" ADD VALUE 'AFTER_SALE';
ALTER TYPE "DocumentType" ADD VALUE 'FINANCIAL_DOCUMENTS';

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_brokerId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "buyerId" TEXT,
ADD COLUMN     "category" "DocumentCategory" NOT NULL DEFAULT 'SELLER_UPLOAD',
ADD COLUMN     "downloadedAt" TIMESTAMP(3),
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "listingId" TEXT,
ADD COLUMN     "operationType" "DocumentOperationType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stepId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "uploadedAt" TIMESTAMP(3),
ADD COLUMN     "uploadedBy" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "brokerId",
ADD COLUMN     "lastReadAt" TIMESTAMP(3),
ADD COLUMN     "managerId" TEXT,
ADD COLUMN     "unreadCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Broker";

-- CreateTable
CREATE TABLE "SellerProgress" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" JSONB NOT NULL DEFAULT '[]',
    "selectedListingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerProgress" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" JSONB NOT NULL DEFAULT '[]',
    "selectedListingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),
    "senderId" TEXT NOT NULL,
    "senderType" "UserRole" NOT NULL,
    "senderName" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "receiverType" "UserRole" NOT NULL,
    "receiverName" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "parentMessageId" TEXT,
    "threadId" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerQuestionnaire" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreCloseChecklist" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerItems" JSONB NOT NULL DEFAULT '{}',
    "sellerItems" JSONB NOT NULL DEFAULT '{}',
    "brokerItems" JSONB NOT NULL DEFAULT '{}',
    "lastUpdatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreCloseChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DueDiligenceRequest" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "status" "DueDiligenceStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DueDiligenceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BuyerListings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuyerListings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerProgress_sellerId_key" ON "SellerProgress"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerProgress_buyerId_key" ON "BuyerProgress"("buyerId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerQuestionnaire_sellerId_key" ON "SellerQuestionnaire"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "PreCloseChecklist_listingId_key" ON "PreCloseChecklist"("listingId");

-- CreateIndex
CREATE INDEX "DueDiligenceRequest_listingId_idx" ON "DueDiligenceRequest"("listingId");

-- CreateIndex
CREATE INDEX "DueDiligenceRequest_buyerId_idx" ON "DueDiligenceRequest"("buyerId");

-- CreateIndex
CREATE INDEX "DueDiligenceRequest_status_idx" ON "DueDiligenceRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DueDiligenceRequest_listingId_buyerId_documentName_key" ON "DueDiligenceRequest"("listingId", "buyerId", "documentName");

-- CreateIndex
CREATE INDEX "_BuyerListings_B_index" ON "_BuyerListings"("B");

-- CreateIndex
CREATE INDEX "Document_sellerId_idx" ON "Document"("sellerId");

-- CreateIndex
CREATE INDEX "Document_buyerId_idx" ON "Document"("buyerId");

-- CreateIndex
CREATE INDEX "Document_listingId_idx" ON "Document"("listingId");

-- CreateIndex
CREATE INDEX "Document_stepId_idx" ON "Document"("stepId");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_category_idx" ON "Document"("category");

-- CreateIndex
CREATE INDEX "Document_sellerId_stepId_idx" ON "Document"("sellerId", "stepId");

-- CreateIndex
CREATE INDEX "Document_sellerId_type_category_idx" ON "Document"("sellerId", "type", "category");

-- CreateIndex
CREATE INDEX "Document_listingId_category_idx" ON "Document"("listingId", "category");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerProgress" ADD CONSTRAINT "SellerProgress_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerProgress" ADD CONSTRAINT "SellerProgress_selectedListingId_fkey" FOREIGN KEY ("selectedListingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerProgress" ADD CONSTRAINT "BuyerProgress_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerProgress" ADD CONSTRAINT "BuyerProgress_selectedListingId_fkey" FOREIGN KEY ("selectedListingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerQuestionnaire" ADD CONSTRAINT "SellerQuestionnaire_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreCloseChecklist" ADD CONSTRAINT "PreCloseChecklist_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreCloseChecklist" ADD CONSTRAINT "PreCloseChecklist_lastUpdatedBy_fkey" FOREIGN KEY ("lastUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DueDiligenceRequest" ADD CONSTRAINT "DueDiligenceRequest_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DueDiligenceRequest" ADD CONSTRAINT "DueDiligenceRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuyerListings" ADD CONSTRAINT "_BuyerListings_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuyerListings" ADD CONSTRAINT "_BuyerListings_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
