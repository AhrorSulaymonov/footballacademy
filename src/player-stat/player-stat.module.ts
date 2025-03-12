import { Module } from "@nestjs/common";
import { PlayerStatService } from "./player-stat.service";
import { PlayerStatController } from "./player-stat.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PlayerStatController],
  providers: [PlayerStatService],
  exports: [PlayerStatService],
})
export class PlayerStatModule {}
