/*
  Warnings:

  - The values [NOTE_TAKEN] on the enum `MEDICINE_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MEDICINE_STATUS_new" AS ENUM ('ONTIME', 'LATE', 'NOT_TAKEN');
ALTER TABLE "MedicineHistory" ALTER COLUMN "status" TYPE "MEDICINE_STATUS_new" USING ("status"::text::"MEDICINE_STATUS_new");
ALTER TYPE "MEDICINE_STATUS" RENAME TO "MEDICINE_STATUS_old";
ALTER TYPE "MEDICINE_STATUS_new" RENAME TO "MEDICINE_STATUS";
DROP TYPE "MEDICINE_STATUS_old";
COMMIT;
