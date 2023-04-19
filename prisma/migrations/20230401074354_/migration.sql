/*
  Warnings:

  - You are about to drop the column `freq` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `reminder_typer` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "freq",
DROP COLUMN "reminder_typer",
ADD COLUMN     "reminder_type" "REMINDER_TYPE";
