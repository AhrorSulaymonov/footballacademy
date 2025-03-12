import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreatePlayerEquipmentDto {
  @ApiProperty({ example: 1, description: "O'yinchi IDsi" })
  @IsInt()
  @IsOptional()
  playerId?: number;

  @ApiProperty({ example: 1, description: "Uskuna IDsi" })
  @IsInt()
  @IsOptional()
  equipmentId?: number;

  @ApiProperty({ example: 2, description: "Uskunaning soni" })
  @IsInt()
  @IsNotEmpty()
  count: number;
}
