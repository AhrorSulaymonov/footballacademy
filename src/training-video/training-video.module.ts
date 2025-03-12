import { Module } from "@nestjs/common";
import { TrainingVideoService } from "./training-video.service";
import { TrainingVideoController } from "./training-video.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [TrainingVideoController],
  providers: [TrainingVideoService],
  exports: [TrainingVideoService],
})
export class TrainingVideoModule {}
