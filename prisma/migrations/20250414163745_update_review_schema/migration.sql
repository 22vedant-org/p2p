/*
  Warnings:

  - You are about to drop the column `comment` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `blockAddress` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likes` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "comment",
ADD COLUMN     "blockAddress" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
