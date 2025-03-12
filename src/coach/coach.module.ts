import { Module } from "@nestjs/common";
import { CoachService } from "./coach.service";
import { CoachController } from "./coach.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CoachController],
  providers: [CoachService],
  exports: [CoachService],
})
export class CoachModule {}
