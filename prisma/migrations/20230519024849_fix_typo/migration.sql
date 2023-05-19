/*
  Warnings:

  - You are about to drop the column `scheduke` on the `MedicineHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicineHistory" DROP COLUMN "scheduke",
ADD COLUMN     "schedule" TEXT;
