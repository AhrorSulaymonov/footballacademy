import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; // <-- Swagger uchun kerakli import

export class SignInUserDto {
  @ApiProperty({
    description:
      "Foydalanuvchining tizimga kirish uchun ishlatiladigan email manzili",
    example: "user@example.com",
    format: "email", // Bu @IsEmail() bilan mos keladi
    required: true, // @IsNotEmpty() bilan mos keladi (garchi default true bo'lsa ham)
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: "Foydalanuvchining tizimga kirish uchun paroli",
    example: "securePassword456",
    type: String, // Bu @IsString() bilan mos keladi
    required: true, // Bu @IsNotEmpty() bilan mos keladi
    // minLength: 6,  // Agar parol uchun minimal uzunlik talabi bo'lsa, qo'shishingiz mumkin
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
