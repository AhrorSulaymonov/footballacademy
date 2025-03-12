import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
} from "class-validator";

export class CreateTrainingVideoDto {
  @ApiProperty({ example: 1, description: "Mashg'ulot sessiyasi IDsi" })
  @IsInt()
  @IsOptional()
  trainingSessionId?: number;

  @ApiProperty({ example: 2, description: "Murabbiy IDsi" })
  @IsInt()
  @IsOptional()
  coachId?: number;

  @ApiProperty({
    example: "https://example.com/video.mp4",
    description: "Trening videosining URL manzili",
  })
  @IsUrl()
  @IsNotEmpty()
  video_url: string;

  @ApiProperty({
    example: ["dribbling", "passing"],
    description: "Trening videosiga tegishli teglar",
    type: [String],
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: "O'yinchining dribling texnikasi yaxshilanmoqda.",
    description: "Video tahlil hisobot",
  })
  @IsString()
  @IsOptional()
  analysis_report?: string;
}
