-- CreateEnum
CREATE TYPE "BugEnum" AS ENUM ('Map', 'Dashboard', 'RideBooking', 'Payments', 'ReviewS', 'Settings');

-- CreateTable
CREATE TABLE "bugs" (
    "id" TEXT NOT NULL,
    "Area" "BugEnum" NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "bugs_pkey" PRIMARY KEY ("id")
);
