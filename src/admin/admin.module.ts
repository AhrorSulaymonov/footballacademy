import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { FileAmazonService } from "../file-amazon/file-amazon.service";
import {
  AccessTokenAdminStrategy,
  RefreshTokenAdminStrategy,
} from "../common/strategies";

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    FileAmazonService,
    AccessTokenAdminStrategy,
    RefreshTokenAdminStrategy,
  ],
  exports: [AdminService],
})
export class AdminModule {}
