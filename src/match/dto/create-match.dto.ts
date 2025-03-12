import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
} from "class-validator";
import { MatchResult } from "@prisma/client";

export class CreateMatchDto {
  @ApiProperty({ example: 1, description: "Jamoa IDsi" })
  @IsInt()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ example: "Real Madrid", description: "Raqib jamoa nomi" })
  @IsString()
  @IsNotEmpty()
  opponent_team: string;

  @ApiProperty({
    example: "2025-03-15T14:00:00.000Z",
    description: "O'yin sanasi",
  })
  @IsDateString()
  @IsNotEmpty()
  match_date: string;

  @ApiProperty({ example: "Tashkent Stadium", description: "O'yin joylashuvi" })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    enum: MatchResult,
    example: "WIN",
    description: "O'yin natijasi",
  })
  @IsEnum(MatchResult)
  @IsOptional()
  result?: MatchResult;

  @ApiProperty({ example: "2-1", description: "O'yin hisobi" })
  @IsString()
  @IsOptional()
  score?: string;

  @ApiProperty({ example: "4-4-2", description: "Jamoa tuzilishi" })
  @IsString()
  @IsOptional()
  formation?: string;
}
