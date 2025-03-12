import { Module } from "@nestjs/common";
import { PlayerParentService } from "./player-parent.service";
import { PlayerParentController } from "./player-parent.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PlayerParentController],
  providers: [PlayerParentService],
  exports: [PlayerParentService],
})
export class PlayerParentModule {}
