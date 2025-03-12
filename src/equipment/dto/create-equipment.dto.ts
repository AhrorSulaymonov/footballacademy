import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsDateString,
} from "class-validator";
import { EquipmentStatus } from "@prisma/client";

export class CreateEquipmentDto {
  @ApiProperty({ example: "Futbol topi", description: "Uskunaning nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 10, description: "Uskunaning soni" })
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: "2025-03-10T00:00:00.000Z",
    description: "Oxirgi ta'mirlash sanasi",
  })
  @IsDateString()
  @IsNotEmpty()
  last_maintenance: string;

  @ApiProperty({
    enum: EquipmentStatus,
    example: "GOOD",
    description: "Uskunaning holati",
  })
  @IsEnum(EquipmentStatus)
  @IsNotEmpty()
  status: EquipmentStatus;
}
