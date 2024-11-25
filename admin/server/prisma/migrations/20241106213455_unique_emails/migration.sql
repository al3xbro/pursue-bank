/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
