import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { FileAmazonService } from "../file-amazon/file-amazon.service";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [UserController],
  providers: [UserService, FileAmazonService],
  exports: [UserService],
})
export class UserModule {}
