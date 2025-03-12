-- DropForeignKey
ALTER TABLE "coaches" DROP CONSTRAINT "coaches_userId_fkey";

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
