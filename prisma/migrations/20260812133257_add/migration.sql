/*
  Warnings:

  - You are about to drop the column `yearsOfExperience` on the `technicianProfiles` table. All the data in the column will be lost.
  - Added the required column `description` to the `services` table without a default value. This is not possible if the table is not empty.
  - Made the column `area` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `services` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "area" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL;

-- AlterTable
ALTER TABLE "technicianProfiles" DROP COLUMN "yearsOfExperience",
ADD COLUMN     "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profilePhoto" TEXT;

-- CreateIndex
CREATE INDEX "services_technicianId_price_idx" ON "services"("technicianId", "price");

-- CreateIndex
CREATE INDEX "technicianProfiles_location_avgRating_idx" ON "technicianProfiles"("location", "avgRating");
