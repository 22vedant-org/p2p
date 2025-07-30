/*
  Warnings:

  - The `rideId` column on the `rides` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "rides" DROP COLUMN "rideId",
ADD COLUMN     "rideId" BIGINT;
