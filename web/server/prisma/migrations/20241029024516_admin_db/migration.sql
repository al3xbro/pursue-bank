/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Admin_Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin_Session" DROP CONSTRAINT "Admin_Session_account_id_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Admin_Session";
