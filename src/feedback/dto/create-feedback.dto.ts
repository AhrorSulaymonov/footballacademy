import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFeedbackDto {
  @ApiProperty({ example: 1, description: "Coach IDsi", required: false })
  @IsInt()
  @IsOptional()
  coachId?: number;

  @ApiProperty({ example: 2, description: "Parent IDsi", required: false })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ example: 3, description: "Player IDsi" })
  @IsInt()
  @IsNotEmpty()
  playerId: number;

  @ApiProperty({
    example: "Yaxshi natija ko'rsatdi!",
    description: "Fikr-mulohaza matni",
  })
  @IsString()
  @IsNotEmpty()
  feedback_text: string;
}
