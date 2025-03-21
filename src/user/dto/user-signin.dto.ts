import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
