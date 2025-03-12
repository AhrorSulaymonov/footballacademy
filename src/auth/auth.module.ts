import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminModule } from "../admin/admin.module";
import {
  AccessTokenAdminStrategy,
  AccessTokenStrategy,
  RefreshTokenAdminStrategy,
  RefreshTokenStrategy,
} from "../common/strategies";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenAdminStrategy,
    RefreshTokenAdminStrategy,
  ],
})
export class AuthModule {}
