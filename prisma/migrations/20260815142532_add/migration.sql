/*
  Warnings:

  - You are about to drop the column `yearsOfExperience` on the `technicianProfiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technicianProfiles" DROP COLUMN "yearsOfExperience",
ADD COLUMN     "experience" INTEGER;
