-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "emailVerifiedAt" DROP NOT NULL,
ALTER COLUMN "companyName" DROP NOT NULL;
