import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { PreferredFoot, MainPosition } from "@prisma/client";

export class CreatePlayerDto {
  @ApiProperty({ example: "1", description: "userId" })
  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty({ example: "2005-01-01", description: "Tug'ilgan sana" })
  @IsDateString()
  @IsNotEmpty()
  date_of_birth: Date;

  @ApiProperty({ example: 1.75, description: "Balandlik (metr)" })
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty({ example: 68.5, description: "Vazn (kg)" })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    example: "LEFT",
    description: "Qaysi oyoqda o'ynaydi",
    enum: PreferredFoot,
  })
  @IsEnum(PreferredFoot)
  @IsNotEmpty()
  preferred_foot: PreferredFoot;

  @ApiProperty({
    example: "Hech qanday kasallik yo'q",
    description: "Tibbiy eslatmalar",
  })
  @IsString()
  @IsNotEmpty()
  medical_notes: string;

  @ApiProperty({
    example: "DEFENDER",
    description: "Asosiy pozitsiya",
    enum: MainPosition,
  })
  @IsEnum(MainPosition)
  @IsNotEmpty()
  main_position: MainPosition;

  @ApiPropertyOptional({ example: 1, description: "Jamo IDsi" })
  @IsNumber()
  @IsOptional()
  teamId?: number;
}
