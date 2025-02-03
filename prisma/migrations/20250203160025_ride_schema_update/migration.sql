-- DropIndex
DROP INDEX "rides_smartContractAddress_key";

-- AlterTable
ALTER TABLE "rides" ALTER COLUMN "smartContractAddress" DROP NOT NULL;
