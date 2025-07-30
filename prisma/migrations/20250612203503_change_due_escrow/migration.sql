/*
  Warnings:

  - You are about to drop the column `smartContractAddress` on the `rides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rides" DROP COLUMN "smartContractAddress",
ADD COLUMN     "escrowAddress" TEXT,
ADD COLUMN     "pricePerSeat" DOUBLE PRECISION,
ADD COLUMN     "rideId" TEXT;
