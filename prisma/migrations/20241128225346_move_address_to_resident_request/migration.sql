/*
  Warnings:

  - You are about to drop the column `addressId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_addressId_fkey";

-- AlterTable
ALTER TABLE "resident_requests" ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "addressId";

-- AddForeignKey
ALTER TABLE "resident_requests" ADD CONSTRAINT "resident_requests_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
