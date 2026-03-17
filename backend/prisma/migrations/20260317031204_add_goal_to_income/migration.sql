-- AlterTable
ALTER TABLE "income" ADD COLUMN     "goalId" UUID;

-- CreateIndex
CREATE INDEX "income_goalId_idx" ON "income"("goalId");

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
