import { Module } from "@nestjs/common";
import { SkillCategoryService } from "./skill-category.service";
import { SkillCategoryController } from "./skill-category.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SkillCategoryController],
  providers: [SkillCategoryService],
  exports: [SkillCategoryService],
})
export class SkillCategoryModule {}
