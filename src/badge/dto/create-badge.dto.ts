import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from "class-validator";
import { Transform } from "class-transformer"; // Import qilish kerak
import { BadgeType } from "@prisma/client";
import { Express } from "express";

export class CreateBadgeDto {
  @ApiProperty({ example: 1, description: "Player IDsi" })
  @Transform(({ value }) => Number(value)) // Number ga aylantiramiz
  @IsInt()
  @IsNotEmpty()
  playerId: number;

  @ApiProperty({
    example: "TOP_SCORER",
    description: "Mukofot turi",
    enum: BadgeType,
  })
  @IsEnum(BadgeType)
  @IsNotEmpty()
  badge_type: BadgeType;

  @ApiProperty({ example: 2, description: "Coach IDsi" })
  @Transform(({ value }) => Number(value)) // Number ga aylantiramiz
  @IsInt()
  @IsNotEmpty()
  coachId: number;

  @ApiProperty({
    example: "2025-03-10T12:00:00.000Z",
    description: "Mukofot berilgan sana",
  })
  @IsDateString()
  @IsNotEmpty()
  awarded_date: Date;

  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Mukofot rasmi (fayl sifatida yuklash)",
  })
  @IsOptional()
  image?: Express.Multer.File;
}
