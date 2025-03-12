import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateEventDto {
  @ApiProperty({ example: "Annual Sports Meet", description: "Tadbir nomi" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1, description: "Admin IDsi" })
  @IsInt()
  @IsOptional()
  adminId?: number;

  @ApiProperty({
    example: "2025-03-20T09:00:00.000Z",
    description: "Tadbir sanasi",
  })
  @IsDateString()
  @IsNotEmpty()
  event_date: string;

  @ApiProperty({ example: "Central Stadium", description: "Tadbir joylashuvi" })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 100,
    description: "Maksimal ishtirokchilar soni",
  })
  @IsInt()
  @IsNotEmpty()
  max_participants: number;
}
