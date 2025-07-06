-- DropForeignKey
ALTER TABLE "BuyerNDA" DROP CONSTRAINT "BuyerNDA_buyerId_fkey";

-- AlterTable
ALTER TABLE "BuyerNDA" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "BuyerFinancialStatement" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuyerFinancialStatement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuyerFinancialStatement_buyerId_key" ON "BuyerFinancialStatement"("buyerId");

-- AddForeignKey
ALTER TABLE "BuyerNDA" ADD CONSTRAINT "BuyerNDA_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerFinancialStatement" ADD CONSTRAINT "BuyerFinancialStatement_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
