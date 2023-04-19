-- AlterTable
ALTER TABLE "SensorBox" ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "SmartBracelet" ALTER COLUMN "temperature" DROP NOT NULL;
