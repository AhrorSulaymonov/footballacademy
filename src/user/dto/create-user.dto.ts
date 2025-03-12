import { ApiProperty, ApiPropertyOptional, ApiConsumes } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from "class-validator";
import { Role } from "@prisma/client";
import { CreatePlayerDto } from "./create-player.dto";
import { CreateParentDto } from "./create-parent.dto";
import { CreateCoachDto } from "./create-coach.dto";

export class CreateUserDto {
  @ApiProperty({ example: "John", description: "Ism" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({ example: "Doe", description: "Familiya" })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({ example: "john@example.com", description: "Email" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "+998901234567", description: "Telefon raqami" })
  @IsPhoneNumber("UZ")
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: "password123!", description: "Parol" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: "password123!", description: "Parolni takrorlang" })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  @ApiProperty({
    example: "PLAYER",
    description: "Rol (PLAYER, PARENT, COACH)",
    enum: Role,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiPropertyOptional({
    type: CreatePlayerDto,
    description: "Player ma'lumotlari",
  })
  @ValidateIf((o) => o.role === "PLAYER")
  @IsNotEmpty()
  playerData?: CreatePlayerDto;

  @ApiPropertyOptional({
    type: CreateParentDto,
    description: "Parent ma'lumotlari",
  })
  @ValidateIf((o) => o.role === "PARENT")
  @IsNotEmpty()
  parentData?: CreateParentDto;

  @ApiPropertyOptional({
    type: CreateCoachDto,
    description: "Coach ma'lumotlari",
  })
  @ValidateIf((o) => o.role === "COACH")
  @IsNotEmpty()
  coachData?: CreateCoachDto;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Foydalanuvchi rasmi (fayl sifatida yuklash)",
  })
  @IsOptional()
  image?: any;
}
