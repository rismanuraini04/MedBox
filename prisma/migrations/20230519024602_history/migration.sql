-- CreateEnum
CREATE TYPE "MEDICINE_STATUS" AS ENUM ('ONTIME', 'LATE');

-- CreateTable
CREATE TABLE "MedicineHistory" (
    "id" TEXT NOT NULL,
    "status" "MEDICINE_STATUS",
    "scheduke" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sensorBoxId" TEXT,

    CONSTRAINT "MedicineHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicineHistory" ADD CONSTRAINT "MedicineHistory_sensorBoxId_fkey" FOREIGN KEY ("sensorBoxId") REFERENCES "SensorBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
