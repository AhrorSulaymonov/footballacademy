import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { AttendanceStatus } from "@prisma/client";

export class CreateAttendanceDto {
  @ApiProperty({ example: 1, description: "Mashg'ulot sessiyasi IDsi" })
  @IsInt()
  @IsOptional()
  trainingSessionId?: number;

  @ApiProperty({ example: 1, description: "O'yinchi IDsi" })
  @IsInt()
  @IsOptional()
  playerId?: number;

  @ApiProperty({
    enum: AttendanceStatus,
    example: "PRESENT",
    description: "Ishtirok holati",
  })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @ApiProperty({ example: 2, description: "Murabbiy IDsi" })
  @IsInt()
  @IsOptional()
  coachId?: number;

  @ApiProperty({
    example: 30,
    description: "Kechikish yoki kechirimli daqiqalar (daqiqalarda)",
  })
  @IsInt()
  @IsOptional()
  excused_minutes?: number;
}
