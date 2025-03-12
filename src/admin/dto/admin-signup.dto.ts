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
} from "class-validator";

export class SignupAdminDto {
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
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "Parolni tasdiqlash",
  })
  @IsString()
  @IsNotEmpty()
  readonly confirm_password: string;
}
