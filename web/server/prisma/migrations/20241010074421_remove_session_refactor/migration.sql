/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_account_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Session";
