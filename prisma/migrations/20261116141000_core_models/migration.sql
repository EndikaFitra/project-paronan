-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payerId" TEXT NOT NULL,
    "splitMode" TEXT NOT NULL DEFAULT 'EQUALS',
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("amount", "createdAt", "deletedAt", "description", "id", "payerId", "roomId", "splitMode") SELECT "amount", "createdAt", "deletedAt", "description", "id", "payerId", "roomId", "splitMode" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE INDEX "Expense_roomId_idx" ON "Expense"("roomId");
CREATE INDEX "Expense_payerId_idx" ON "Expense"("payerId");
CREATE TABLE "new_ExpenseSplit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "shares" INTEGER NOT NULL DEFAULT 1,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExpenseSplit_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExpenseSplit_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExpenseSplit" ("amount", "createdAt", "expenseId", "id", "memberId") SELECT "amount", "createdAt", "expenseId", "id", "memberId" FROM "ExpenseSplit";
DROP TABLE "ExpenseSplit";
ALTER TABLE "new_ExpenseSplit" RENAME TO "ExpenseSplit";
CREATE INDEX "ExpenseSplit_memberId_idx" ON "ExpenseSplit"("memberId");
CREATE UNIQUE INDEX "ExpenseSplit_expenseId_memberId_key" ON "ExpenseSplit"("expenseId", "memberId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Member_roomId_name_key" ON "Member"("roomId", "name");

