/*
  Warnings:

  - The `endLocationCoord` column on the `rides` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `startLocationCoord` column on the `rides` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "rides" DROP COLUMN "endLocationCoord",
ADD COLUMN     "endLocationCoord" DOUBLE PRECISION[],
DROP COLUMN "startLocationCoord",
ADD COLUMN     "startLocationCoord" DOUBLE PRECISION[];
