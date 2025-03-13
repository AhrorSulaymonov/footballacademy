import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateAdminDto {
  @ApiProperty({ example: "John", description: "Adminning ismi" })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({ example: "Doe", description: "Adminning familiyasi" })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({
    example: "+998901234567",
    description: "Adminning telefon raqami",
  })
  @IsString()
  @IsPhoneNumber("UZ")
  readonly phone: string;

  @ApiPropertyOptional({
    example: "johndoe",
    description: "Adminning foydalanuvchi nomi",
  })
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiProperty({
    example: "johndoe@gmail.com",
    description: "Adminning emaili",
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: "StrongPassword123!", description: "Admin paroli" })
  @IsStrongPassword()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "Parolni tasdiqlash",
  })
  @IsString()
  @IsNotEmpty()
  readonly confirm_password: string;

  @ApiPropertyOptional({
    example: true,
    description: "Admin yaratgan foydalanuvchi ekanligini bildiradi",
  })
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true) // ✅ Boolean formatga o'tkazish
  @IsOptional()
  readonly is_creator?: boolean;
}
