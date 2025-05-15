/*
  Warnings:

  - You are about to drop the column `pricePerSeat` on the `rides` table. All the data in the column will be lost.
  - Added the required column `initialDeposit` to the `rides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rides" DROP COLUMN "pricePerSeat",
ADD COLUMN     "initialDeposit" DOUBLE PRECISION NOT NULL;
