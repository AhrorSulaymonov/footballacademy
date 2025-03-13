import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateUserPasswordDto {
  @ApiProperty({ example: "oldpassword123!", description: "Eski parol" })
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({ example: "newpassword123!", description: "Yangi parol" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;

  @ApiProperty({
    example: "newpassword123!",
    description: "Yangi parolni tasdiqlash",
  })
  @IsString()
  @IsNotEmpty()
  confirm_new_password: string;
}
