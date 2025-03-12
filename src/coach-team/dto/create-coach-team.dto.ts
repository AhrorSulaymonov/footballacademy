import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCoachTeamDto {
  @ApiProperty({ example: 1, description: "Murabbiy IDsi" })
  @IsNumber()
  @IsNotEmpty()
  coachId?: number;

  @ApiProperty({ example: 2, description: "Jamoa IDsi" })
  @IsNumber()
  @IsNotEmpty()
  teamId?: number;

  @ApiProperty({ example: true, description: "Asosiy murabbiy ekanligi" })
  @IsBoolean()
  @IsOptional()
  is_main?: boolean;
}
