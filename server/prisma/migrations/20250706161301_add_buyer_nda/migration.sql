-- AlterEnum
ALTER TYPE "ListingStatus" ADD VALUE 'INACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "BuyerNDA" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerNDA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuyerNDA_buyerId_key" ON "BuyerNDA"("buyerId");

-- AddForeignKey
ALTER TABLE "BuyerNDA" ADD CONSTRAINT "BuyerNDA_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
