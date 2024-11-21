/*
  Warnings:

  - You are about to drop the `Symptom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VitalSigns` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN "symptomsInformation" TEXT;
ALTER TABLE "MedicalRecord" ADD COLUMN "vitalSignsInformation" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Symptom";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VitalSigns";
PRAGMA foreign_keys=on;
