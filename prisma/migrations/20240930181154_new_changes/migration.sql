/*
  Warnings:

  - You are about to drop the column `description` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Permissions` table. All the data in the column will be lost.
  - Added the required column `permission_name` to the `Permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permission_name" TEXT NOT NULL,
    "permission_description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Permissions" ("id") SELECT "id" FROM "Permissions";
DROP TABLE "Permissions";
ALTER TABLE "new_Permissions" RENAME TO "Permissions";
CREATE UNIQUE INDEX "Permissions_permission_name_key" ON "Permissions"("permission_name");
CREATE TABLE "new_RolesPermissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("roleId", "permissionId"),
    CONSTRAINT "RolesPermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RolesPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permissions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RolesPermissions" ("permissionId", "roleId") SELECT "permissionId", "roleId" FROM "RolesPermissions";
DROP TABLE "RolesPermissions";
ALTER TABLE "new_RolesPermissions" RENAME TO "RolesPermissions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
