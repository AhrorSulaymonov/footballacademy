import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsOptional } from "class-validator";

export class CreatePositionDto {
  @ApiProperty({ example: "Center Forward", description: "Pozitsiya nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "The player responsible for scoring goals",
    description: "Pozitsiya tavsifi",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1,
    description: "Yuqori darajadagi pozitsiya IDsi (agar mavjud bo'lsa)",
  })
  @IsInt()
  @IsOptional()
  parentPositionId?: number;
}
