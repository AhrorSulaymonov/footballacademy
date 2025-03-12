import { Module } from "@nestjs/common";
import { MedicalRecordService } from "./medical-record.service";
import { MedicalRecordController } from "./medical-record.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
