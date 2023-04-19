-- CreateEnum
CREATE TYPE "REMINDER_TYPE" AS ENUM ('X_TIME_DAY', 'EVERY_X_DAY', 'EVERY_X_WEEK');

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "finishDate" TIMESTAMP(3),
    "interval" TEXT,
    "freq" TEXT,
    "time" TEXT,
    "reminder_before" TEXT,
    "reminder_after" TEXT,
    "reminder_typer" "REMINDER_TYPE",
    "reminder_status" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sensorBoxId" TEXT,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_sensorBoxId_fkey" FOREIGN KEY ("sensorBoxId") REFERENCES "SensorBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
