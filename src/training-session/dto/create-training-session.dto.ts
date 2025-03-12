import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTrainingSessionDto {
  @ApiProperty({ example: 1, description: "Jamoa IDsi" })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ example: 2, description: "Murabbiy IDsi" })
  @IsNumber()
  @IsOptional()
  coachId?: number;

  @ApiProperty({
    example: "2025-03-15T10:00:00.000Z",
    description: "Mashg'ulot sanasi",
  })
  @IsDateString()
  @IsNotEmpty()
  session_date: string;

  @ApiProperty({
    example: 90,
    description: "Mashg'ulot davomiyligi (daqiqalarda)",
  })
  @IsInt()
  @IsNotEmpty()
  duration_minutes: number;

  @ApiProperty({
    example: "Toshkent stadion",
    description: "Mashg'ulot joylashuvi",
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: "Jismoniy tayyorgarlik",
    description: "Mashg'ulot maqsadlari",
  })
  @IsString()
  @IsNotEmpty()
  objectives: string;
}
