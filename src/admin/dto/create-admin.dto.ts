import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  // IsNumber, // Bu DTO da ishlatilmagan
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
  // @IsNotEmpty() // Agar email ixtiyoriy bo'lsa, buni olib tashlang yoki @IsOptional qo'shing. Hozircha qoldiramiz.
  readonly email: string; // Agar IsNotEmpty qolsa, readonly email!: string; bo'lishi mumkin.

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
    type: Boolean, // <-- Swagger uchun tipni aniq ko'rsatish
  })
  @IsBoolean()
  @Transform(({ value }) => {
    // string "true"/"false" ni boolean ga o'tkazish
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsOptional()
  readonly is_creator?: boolean;
}
