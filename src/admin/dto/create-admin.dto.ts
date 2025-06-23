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
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsOptional()
  readonly is_creator?: boolean;

  @ApiPropertyOptional({
    // <-- RASM UCHUN QO'SHILDI
    type: "string",
    format: "binary",
    description: "Adminning profil rasmi (ixtiyoriy)",
    required: false, // Agar rasm majburiy bo'lsa, buni olib tashlang yoki true qiling
  })
  @IsOptional() // Agar rasm ixtiyoriy bo'lsa
  // @IsNotEmpty() // Agar rasm majburiy bo'lsa, class-validator uchun
  readonly image?: any; // Fayllar uchun 'any' yoki Express.Multer.File tipi ishlatiladi, lekin DTO da 'any' qulayroq
}
