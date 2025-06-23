import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; // <-- Swagger uchun kerakli import

export class SignInAdminDto {
  @ApiProperty({
    description: "Adminning tizimga kirish uchun ishlatiladigan email manzili",
    example: "admin@example.com",
    format: "email", // Bu @IsEmail() bilan mos keladi
    required: true, // @IsNotEmpty() bilan mos keladi (garchi default true bo'lsa ham)
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: "Adminning tizimga kirish uchun paroli",
    example: "superSecretPassword123",
    type: String, // Bu @IsString() bilan mos keladi
    required: true, // Bu @IsNotEmpty() bilan mos keladi
    // minLength: 8,  // Agar parol uchun minimal uzunlik talabi bo'lsa, qo'shishingiz mumkin
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
