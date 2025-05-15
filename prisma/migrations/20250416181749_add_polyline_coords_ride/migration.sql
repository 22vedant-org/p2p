/*
  Warnings:

  - Added the required column `polyLineCoords` to the `rides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rides" ADD COLUMN     "polyLineCoords" JSONB NOT NULL;
