/*
  Warnings:

  - You are about to alter the column `serviceName` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(75)`.

*/
-- AlterTable
ALTER TABLE "services" ALTER COLUMN "serviceName" SET DATA TYPE VARCHAR(75);
