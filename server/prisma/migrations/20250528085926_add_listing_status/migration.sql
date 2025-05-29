-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('NDA', 'LISTING_AGREEMENT', 'FINANCIAL_STATEMENT', 'PURCHASE_CONTRACT');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
