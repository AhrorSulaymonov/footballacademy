import { Module } from "@nestjs/common";
import { TeamEquipmentService } from "./team-equipment.service";
import { TeamEquipmentController } from "./team-equipment.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [TeamEquipmentController],
  providers: [TeamEquipmentService],
  exports: [TeamEquipmentService],
})
export class TeamEquipmentModule {}
