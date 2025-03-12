import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from "class-validator";

export class CreatePlayerStatDto {
  @ApiProperty({ example: 1, description: "O'yinchi IDsi" })
  @IsInt()
  @IsOptional()
  playerId?: number;

  @ApiProperty({ example: 1, description: "Match IDsi" })
  @IsInt()
  @IsOptional()
  matchId?: number;

  @ApiProperty({ example: 2, description: "Gol soni" })
  @IsInt()
  @IsOptional()
  goals?: number;

  @ApiProperty({ example: 1, description: "Assist soni" })
  @IsInt()
  @IsOptional()
  assists?: number;

  @ApiProperty({ example: 3, description: "Tackle soni" })
  @IsInt()
  @IsOptional()
  tackles?: number;

  @ApiProperty({
    example: 85.5,
    description: "Paslarning aniqligi (foizda)",
  })
  @IsNumber()
  @IsOptional()
  passes_accuracy?: number;

  @ApiProperty({ example: 1, description: "Sariq kartochkalar soni" })
  @IsInt()
  @IsOptional()
  yellow_cards?: number;

  @ApiProperty({ example: false, description: "Qizil kartochka borligi" })
  @IsBoolean()
  @IsOptional()
  red_card?: boolean;

  @ApiProperty({ example: 1, description: "Pozitsiya IDsi" })
  @IsInt()
  @IsOptional()
  positionId?: number;
}
