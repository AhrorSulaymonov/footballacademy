import { Module } from "@nestjs/common";
import { CoachTeamService } from "./coach-team.service";
import { CoachTeamController } from "./coach-team.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CoachTeamController],
  providers: [CoachTeamService],
  exports: [CoachTeamService],
})
export class CoachTeamModule {}
