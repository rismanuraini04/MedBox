-- CreateTable
CREATE TABLE "BodyTemperatureHistory" (
    "id" TEXT NOT NULL,
    "temperature" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "smartBraceletId" TEXT,

    CONSTRAINT "BodyTemperatureHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BodyTemperatureHistory" ADD CONSTRAINT "BodyTemperatureHistory_smartBraceletId_fkey" FOREIGN KEY ("smartBraceletId") REFERENCES "SmartBracelet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
