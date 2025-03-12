/*
  Warnings:

  - You are about to drop the `EventRegistration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_parent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_userId_fkey";

-- DropForeignKey
ALTER TABLE "student_parent" DROP CONSTRAINT "student_parent_parentsId_fkey";

-- DropForeignKey
ALTER TABLE "student_parent" DROP CONSTRAINT "student_parent_playerId_fkey";

-- DropTable
DROP TABLE "EventRegistration";

-- DropTable
DROP TABLE "student_parent";

-- CreateTable
CREATE TABLE "Player_parent" (
    "id" SERIAL NOT NULL,
    "parentsId" INTEGER,
    "playerId" INTEGER,
    "relationship" "Relationship" NOT NULL,

    CONSTRAINT "Player_parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registration" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER,
    "userId" INTEGER,
    "registration_date" TIMESTAMP(3) NOT NULL,
    "status" "EventRegistrationStatus" NOT NULL,

    CONSTRAINT "event_registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player_parent" ADD CONSTRAINT "Player_parent_parentsId_fkey" FOREIGN KEY ("parentsId") REFERENCES "parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player_parent" ADD CONSTRAINT "Player_parent_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
