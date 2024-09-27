-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT,
    "first_last_name" TEXT NOT NULL,
    "second_last_name" TEXT NOT NULL,
    "ci" TEXT NOT NULL DEFAULT '12345678',
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "Personal_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personal" ("createdAt", "email", "first_last_name", "first_name", "id", "isActive", "password", "phone_number", "roleId", "second_last_name", "second_name", "updatedAt") SELECT "createdAt", "email", "first_last_name", "first_name", "id", "isActive", "password", "phone_number", "roleId", "second_last_name", "second_name", "updatedAt" FROM "Personal";
DROP TABLE "Personal";
ALTER TABLE "new_Personal" RENAME TO "Personal";
CREATE UNIQUE INDEX "Personal_ci_key" ON "Personal"("ci");
CREATE UNIQUE INDEX "Personal_email_key" ON "Personal"("email");
CREATE UNIQUE INDEX "Personal_password_key" ON "Personal"("password");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
