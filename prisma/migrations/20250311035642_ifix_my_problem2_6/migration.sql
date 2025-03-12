/*
  Warnings:

  - Added the required column `update_date` to the `event_registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_registration" ADD COLUMN     "update_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "registration_date" SET DEFAULT CURRENT_TIMESTAMP;
