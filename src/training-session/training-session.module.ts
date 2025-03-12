import { Module } from "@nestjs/common";
import { TrainingSessionService } from "./training-session.service";
import { TrainingSessionController } from "./training-session.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [TrainingSessionController],
  providers: [TrainingSessionService],
  exports: [TrainingSessionService],
})
export class TrainingSessionModule {}
