import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSkillEvaluationDto {
  @ApiProperty({ example: 1, description: "Skill IDsi" })
  @IsInt()
  @IsNotEmpty()
  skillId: number;

  @ApiProperty({ example: 2, description: "Coach IDsi", required: false })
  @IsInt()
  @IsOptional()
  coachId?: number;

  @ApiProperty({ example: 3, description: "Player IDsi" })
  @IsInt()
  @IsNotEmpty()
  playerId: number;

  @ApiProperty({ example: 8, description: "Berilgan baho (score)" })
  @IsInt()
  @IsNotEmpty()
  score: number;

  @ApiProperty({
    example: "O'yinchi yaxshi natija ko'rsatdi",
    description: "Baholash eslatmalari",
  })
  @IsString()
  @IsNotEmpty()
  notes: string;
}
