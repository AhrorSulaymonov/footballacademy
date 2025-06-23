import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer"; // Bu DTO da ishlatilmayapti, olib tashlasa bo'ladi
import {
  // IsBoolean, // Bu DTO da ishlatilmayapti
  IsEmail,
  IsNotEmpty,
  // IsNumber, // Bu DTO da ishlatilmayapti
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword, // <-- QO'SHILDI: Signup uchun ham kuchli parol talabi
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
  @IsStrongPassword() // <-- QO'SHILDI
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "Parolni tasdiqlash",
  })
  @IsString()
  @IsNotEmpty()
  readonly confirm_password: string;

  @ApiProperty({
    // <-- RASM UCHUN QO'SHILDI (majburiy deb belgilandi)
    type: "string",
    format: "binary",
    description: "Adminning profil rasmi (majburiy)",
    required: true,
  })
  @IsNotEmpty() // Agar rasm majburiy bo'lsa, class-validator uchun
  readonly image: any; // Fayllar uchun 'any' yoki Express.Multer.File tipi ishlatiladi
}
