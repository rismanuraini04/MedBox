-- AlterTable
ALTER TABLE "SmartMedicine" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SmartBracelet" (
    "id" TEXT NOT NULL,
    "uniqCode" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "smartMedicineId" TEXT,

    CONSTRAINT "SmartBracelet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartBracelet_uniqCode_key" ON "SmartBracelet"("uniqCode");

-- CreateIndex
CREATE UNIQUE INDEX "SmartBracelet_smartMedicineId_key" ON "SmartBracelet"("smartMedicineId");

-- AddForeignKey
ALTER TABLE "SmartBracelet" ADD CONSTRAINT "SmartBracelet_smartMedicineId_fkey" FOREIGN KEY ("smartMedicineId") REFERENCES "SmartMedicine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
