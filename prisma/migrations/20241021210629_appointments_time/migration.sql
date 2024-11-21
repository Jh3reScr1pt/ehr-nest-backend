/*
  Warnings:

  - Made the column `end_time` on table `MedicalAppointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_time` on table `MedicalAppointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_time` on table `Schedules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_time` on table `Schedules` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicalAppointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date_appointment" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicalAppointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Personal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MedicalAppointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MedicalAppointment" ("createdAt", "date_appointment", "doctorId", "end_time", "id", "isActive", "patientId", "start_time", "updatedAt") SELECT "createdAt", "date_appointment", "doctorId", "end_time", "id", "isActive", "patientId", "start_time", "updatedAt" FROM "MedicalAppointment";
DROP TABLE "MedicalAppointment";
ALTER TABLE "new_MedicalAppointment" RENAME TO "MedicalAppointment";
CREATE TABLE "new_Schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personalId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Schedules_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schedules" ("createdAt", "day", "end_time", "id", "isActive", "personalId", "start_time", "updatedAt") SELECT "createdAt", "day", "end_time", "id", "isActive", "personalId", "start_time", "updatedAt" FROM "Schedules";
DROP TABLE "Schedules";
ALTER TABLE "new_Schedules" RENAME TO "Schedules";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
