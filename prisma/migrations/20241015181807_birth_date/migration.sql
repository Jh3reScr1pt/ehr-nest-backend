/*
  Warnings:

  - Made the column `address` on table `Patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `Patients` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT,
    "first_last_name" TEXT NOT NULL,
    "second_last_name" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "birth_date" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Patients" ("address", "age", "ci", "createdAt", "first_last_name", "first_name", "id", "isActive", "phone_number", "second_last_name", "second_name", "updatedAt") SELECT "address", "age", "ci", "createdAt", "first_last_name", "first_name", "id", "isActive", "phone_number", "second_last_name", "second_name", "updatedAt" FROM "Patients";
DROP TABLE "Patients";
ALTER TABLE "new_Patients" RENAME TO "Patients";
CREATE UNIQUE INDEX "Patients_ci_key" ON "Patients"("ci");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
