import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTeamDto {
  @ApiProperty({ example: "Tigers U16", description: "Jamoa nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "U16", description: "Jamoaning yosh guruhi" })
  @IsString()
  @IsNotEmpty()
  age_group: string;
}
