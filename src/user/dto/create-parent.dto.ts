import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateParentDto {
  @ApiProperty({ example: "1", description: "userId" })
  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty({ example: "Doktor", description: "Kasbi" })
  @IsString()
  @IsNotEmpty()
  occupation: string;

  @ApiProperty({ example: "+998901234567", description: "Favqulodda aloqa" })
  @IsString()
  @IsNotEmpty()
  emergency_contact: string;
}
