/*
  Warnings:

  - You are about to drop the column `state` on the `Personal` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Roles` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Specialties` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT,
    "first_last_name" TEXT NOT NULL,
    "second_last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "Personal_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personal" ("createdAt", "email", "first_last_name", "first_name", "id", "password", "phone_number", "roleId", "second_last_name", "second_name", "updatedAt") SELECT "createdAt", "email", "first_last_name", "first_name", "id", "password", "phone_number", "roleId", "second_last_name", "second_name", "updatedAt" FROM "Personal";
DROP TABLE "Personal";
ALTER TABLE "new_Personal" RENAME TO "Personal";
CREATE UNIQUE INDEX "Personal_email_key" ON "Personal"("email");
CREATE UNIQUE INDEX "Personal_password_key" ON "Personal"("password");
CREATE TABLE "new_Roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role_name" TEXT NOT NULL,
    "role_description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Roles" ("createdAt", "id", "role_description", "role_name", "updatedAt") SELECT "createdAt", "id", "role_description", "role_name", "updatedAt" FROM "Roles";
DROP TABLE "Roles";
ALTER TABLE "new_Roles" RENAME TO "Roles";
CREATE UNIQUE INDEX "Roles_role_name_key" ON "Roles"("role_name");
CREATE TABLE "new_Specialties" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "specialty_name" TEXT NOT NULL,
    "specialty_description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Specialties" ("createdAt", "id", "specialty_description", "specialty_name", "updatedAt") SELECT "createdAt", "id", "specialty_description", "specialty_name", "updatedAt" FROM "Specialties";
DROP TABLE "Specialties";
ALTER TABLE "new_Specialties" RENAME TO "Specialties";
CREATE UNIQUE INDEX "Specialties_specialty_name_key" ON "Specialties"("specialty_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
