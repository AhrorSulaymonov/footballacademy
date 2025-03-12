import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSkillCategoryDto {
  @ApiProperty({ example: "technical", description: "Skill kategoriyasi nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "Texnik qobiliyatlarni baholash uchun kategoriya",
    description: "Kategoriya tavsifi",
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
