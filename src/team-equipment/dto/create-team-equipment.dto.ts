import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTeamEquipmentDto {
  @ApiProperty({ example: 1, description: "Jamoa IDsi" })
  @IsInt()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ example: 1, description: "Uskuna IDsi" })
  @IsInt()
  @IsOptional()
  equipmentId?: number;

  @ApiProperty({ example: 5, description: "Uskunaning soni" })
  @IsInt()
  @IsNotEmpty()
  count: number;
}
