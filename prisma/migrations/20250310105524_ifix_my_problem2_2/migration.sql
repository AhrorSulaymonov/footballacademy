/*
  Warnings:

  - You are about to alter the column `max_score` on the `skills` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "skills" ALTER COLUMN "max_score" SET DATA TYPE INTEGER;
