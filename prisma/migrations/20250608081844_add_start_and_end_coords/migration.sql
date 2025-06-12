/*
  Warnings:

  - Added the required column `endLocationCoord` to the `rides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLocationCoord` to the `rides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rides" ADD COLUMN     "endLocationCoord" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startLocationCoord" DOUBLE PRECISION NOT NULL;
