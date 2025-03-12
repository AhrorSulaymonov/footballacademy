import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { CoachSpecialization } from "@prisma/client";

export class CreateCoachDto {
  @ApiProperty({ example: "1", description: "userId" })
  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty({ example: "ABC123", description: "Litsenziya raqami" })
  @IsString()
  @IsNotEmpty()
  license_number: string;

  @ApiProperty({
    example: "GOALKEEPER",
    description: "Mutaxassislik => GOALKEEPER, DEFENDER, MIDFIELD, FORWARD",
    enum: CoachSpecialization,
  })
  @IsEnum(CoachSpecialization)
  @IsNotEmpty()
  specialization: CoachSpecialization;

  @ApiProperty({ example: "2023-01-01", description: "Ish boshlagan sana" })
  @IsDateString()
  @IsNotEmpty()
  hire_date: Date;
}
