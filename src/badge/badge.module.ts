import { Module } from "@nestjs/common";
import { BadgeService } from "./badge.service";
import { BadgeController } from "./badge.controller";
import { FileAmazonService } from "../file-amazon/file-amazon.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [BadgeController],
  providers: [BadgeService, FileAmazonService],
  exports: [BadgeService],
})
export class BadgeModule {}
