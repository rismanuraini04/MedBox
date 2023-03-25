-- CreateTable
CREATE TABLE "SmartMedicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "SmartMedicine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartMedicine_userId_key" ON "SmartMedicine"("userId");

-- AddForeignKey
ALTER TABLE "SmartMedicine" ADD CONSTRAINT "SmartMedicine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
