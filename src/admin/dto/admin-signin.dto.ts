import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInAdminDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
