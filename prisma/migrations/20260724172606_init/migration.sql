/*
  Warnings:

  - Added the required column `role` to the `technicianRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technicianRequests" ADD COLUMN     "role" "Role" NOT NULL;
