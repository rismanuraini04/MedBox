-- CreateTable
CREATE TABLE "SmartBox" (
    "id" TEXT NOT NULL,
    "uniqCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "smartMedicineId" TEXT,

    CONSTRAINT "SmartBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartBox_uniqCode_key" ON "SmartBox"("uniqCode");

-- CreateIndex
CREATE UNIQUE INDEX "SmartBox_smartMedicineId_key" ON "SmartBox"("smartMedicineId");

-- AddForeignKey
ALTER TABLE "SmartBox" ADD CONSTRAINT "SmartBox_smartMedicineId_fkey" FOREIGN KEY ("smartMedicineId") REFERENCES "SmartMedicine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
