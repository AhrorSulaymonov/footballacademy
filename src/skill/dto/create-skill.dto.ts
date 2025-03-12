import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSkillDto {
  @ApiProperty({ example: "Dribbling", description: "Skill nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: "Skill kategoriyasi IDsi",
    required: false,
  })
  @IsInt()
  @IsOptional()
  skillCategoryId?: number;

  @ApiProperty({ example: 10, description: "Skill uchun maksimal ball" })
  @IsInt()
  @IsNotEmpty()
  max_score: number;
}
