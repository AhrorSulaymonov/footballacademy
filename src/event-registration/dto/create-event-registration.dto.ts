import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsDateString,
} from "class-validator";
import { EventRegistrationStatus } from "@prisma/client";

export class CreateEventRegistrationDto {
  @ApiProperty({ example: 1, description: "Tadbir IDsi" })
  @IsInt()
  @IsOptional()
  eventId?: number;

  @ApiProperty({ example: 1, description: "Foydalanuvchi IDsi" })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    example: "2025-03-15T10:00:00.000Z",
    description: "Ro'yxatdan o'tish sanasi",
  })
  @IsOptional()
  @IsDateString()
  registration_date?: string; // Bu string bo‘lsa ham, yuqorida new Date() qilib kiritiladi

  @ApiProperty({
    enum: EventRegistrationStatus,
    example: "REGISTERED",
    description: "Ro'yxatdan o'tish holati",
  })
  @IsEnum(EventRegistrationStatus)
  @IsNotEmpty()
  status: EventRegistrationStatus;
}
