/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER_INTERNAL', 'TRANSFER_EXTERNAL', 'INTEREST');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "UserStatus" DEFAULT 'ACTIVE',
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "token" TEXT,
    "session_start" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "transfer_id" INTEGER,
    "transaction_type" "TransactionType",
    "amount" DECIMAL(65,30),
    "origin" TEXT,
    "destination" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3),
    "recurring_id" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recurring_Transaction" (
    "id" SERIAL NOT NULL,
    "day_of_month" INTEGER,
    "account_id" INTEGER,
    "transfer_id" INTEGER,
    "transaction_type" "TransactionType",
    "amount" DECIMAL(65,30),
    "origin" TEXT,
    "destination" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Recurring_Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "password" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin_Session" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "token" TEXT,
    "session_start" TIMESTAMP(3),

    CONSTRAINT "Admin_Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Recurring_Transaction_id_key" ON "Recurring_Transaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Session_id_key" ON "Admin_Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Session_token_key" ON "Admin_Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurring_id_fkey" FOREIGN KEY ("recurring_id") REFERENCES "Recurring_Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin_Session" ADD CONSTRAINT "Admin_Session_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
