import { Module } from "@nestjs/common";
import { PlayerEquipmentService } from "./player-equipment.service";
import { PlayerEquipmentController } from "./player-equipment.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PlayerEquipmentController],
  providers: [PlayerEquipmentService],
  exports: [PlayerEquipmentService],
})
export class PlayerEquipmentModule {}
