import { PartialType } from "@nestjs/swagger"; // <--- MUHIM O'ZGARISH: @nestjs/swagger dan import
import { CreateAdminDto } from "./create-admin.dto";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  // Parol va parolni tasdiqlash maydonlarini UpdateAdminDto dan chiqarib tashlash
  // odatda yaxshi amaliyotdir, chunki parolni yangilash alohida endpoint/DTO orqali amalga oshiriladi.
  // Agar ularni qoldirish kerak bo'lsa, ular PartialType tufayli ixtiyoriy bo'ladi.
  // Agar ularni butunlay o'chirish kerak bo'lsa, OmitType dan foydalanish mumkin:
  // import { PartialType, OmitType } from '@nestjs/swagger';
  // export class UpdateAdminDto extends PartialType(
  //   OmitType(CreateAdminDto, ['password', 'confirm_password'] as const),
  // ) {}
  // Hozircha, asl holatida qoldiramiz, ular ixtiyoriy bo'ladi.
}
