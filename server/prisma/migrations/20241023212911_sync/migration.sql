-- CreateEnum
CREATE TYPE "RecurringTransactionStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "Recurring_Transaction" ADD COLUMN     "status" "RecurringTransactionStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
