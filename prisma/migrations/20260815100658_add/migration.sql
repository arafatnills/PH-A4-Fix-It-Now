/*
  Warnings:

  - You are about to drop the column `experience` on the `technicianProfiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technicianProfiles" DROP COLUMN "experience",
ADD COLUMN     "yearsOfExperience" INTEGER;
