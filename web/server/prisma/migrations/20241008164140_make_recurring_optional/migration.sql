/*
  Warnings:

  - Made the column `transaction_type` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recurring_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "transaction_type" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "recurring_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurring_id_fkey" FOREIGN KEY ("recurring_id") REFERENCES "Recurring_Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
