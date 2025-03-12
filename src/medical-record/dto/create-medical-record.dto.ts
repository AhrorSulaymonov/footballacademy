import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { RecoveryStatus } from "@prisma/client";

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 1, description: "O'yinchi IDsi" })
  @IsNumber()
  @IsNotEmpty()
  playerId: number;

  @ApiProperty({ example: "Knee Injury", description: "Jarohat turi" })
  @IsString()
  @IsNotEmpty()
  injury_type: string;

  @ApiProperty({
    example: "2025-03-10T00:00:00.000Z",
    description: "Tashxis qo'yilgan sana",
  })
  @IsDateString()
  @IsNotEmpty()
  diagnosis_date: Date;

  @ApiProperty({
    example: "ACTIVE",
    description: "Tiklanish holati",
    enum: RecoveryStatus,
  })
  @IsEnum(RecoveryStatus)
  @IsNotEmpty()
  recovery_status: RecoveryStatus;

  @ApiProperty({
    example: "O'yinchi 2 hafta ichida qaytishi kutilmoqda",
    description: "Shifokor yozuvi",
  })
  @IsString()
  @IsNotEmpty()
  doctor_notes: string;
}
