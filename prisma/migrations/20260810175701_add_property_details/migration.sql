-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "serviceCharge" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "utilityCharge" INTEGER NOT NULL DEFAULT 0;
