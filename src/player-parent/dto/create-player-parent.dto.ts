import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Relationship } from "@prisma/client";

export class CreatePlayerParentDto {
  @ApiProperty({ example: 1, description: "Ota-ona IDsi" })
  @IsNumber()
  @IsOptional()
  parentsId?: number;

  @ApiProperty({ example: 2, description: "O'yinchi (talaba) IDsi" })
  @IsNumber()
  @IsOptional()
  playerId?: number;

  @ApiProperty({
    example: "FATHER",
    description: "Ota-onaning o'yinchiga bo'lgan munosabati",
    enum: Relationship,
  })
  @IsEnum(Relationship)
  @IsNotEmpty()
  relationship: Relationship;
}
