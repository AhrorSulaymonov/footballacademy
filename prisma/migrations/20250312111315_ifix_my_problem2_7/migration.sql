/*
  Warnings:

  - A unique constraint covering the columns `[verification]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_verification_key" ON "users"("verification");
