-- CreateTable
CREATE TABLE "SensorBox" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "smartBoxId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SensorBox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SensorBox" ADD CONSTRAINT "SensorBox_smartBoxId_fkey" FOREIGN KEY ("smartBoxId") REFERENCES "SmartBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
