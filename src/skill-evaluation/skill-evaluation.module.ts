import { Module } from "@nestjs/common";
import { SkillEvaluationService } from "./skill-evaluation.service";
import { SkillEvaluationController } from "./skill-evaluation.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SkillEvaluationController],
  providers: [SkillEvaluationService],
  exports: [SkillEvaluationService],
})
export class SkillEvaluationModule {}
