import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { FileAmazonService } from "../file-amazon/file-amazon.service";
import { Admin } from "@prisma/client";
import { CreateAdminDto, UpdateAdminDto, UpdatePasswordDto } from "./dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly fileAmazonService: FileAmazonService
  ) {}
  async create(createAdminDto: CreateAdminDto, image: Express.Multer.File) {
    try {
      const { password, confirm_password, ...data } = createAdminDto;
      const fileUrl = await this.fileAmazonService.uploadFile(image);

      if (password !== confirm_password) {
        throw new BadRequestException("Parollar aynan emas");
      }
      const password_hash = await bcrypt.hash(password, 7);
      const newAdmin = await this.prismaService.admin.create({
        data: {
          first_name: createAdminDto.first_name,
          last_name: createAdminDto.last_name,
          phone: createAdminDto.phone,
          email: createAdminDto.email,
          is_creator: Boolean(createAdminDto.is_creator), // ✅ Boolean formatga o'tkazish
          password_hash,
          image_url: fileUrl,
        },
      });

      return newAdmin;
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  findAdminByEmail(email: string) {
    return this.prismaService.admin.findUnique({ where: { email } });
  }
  findAll() {
    return this.prismaService.admin.findMany({ include: { events: true } });
  }

  findOne(id: number) {
    return this.prismaService.admin.findUnique({
      where: { id },
      include: { events: true },
    });
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updatedAdmin = await this.prismaService.admin.update({
      where: { id },
      data: { refresh_token_hashed: hashed_refresh_token },
    });
    return updatedAdmin;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.prismaService.admin.update({
      where: { id },
      data: { ...updateAdminDto },
    });
  }

  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      is_creator: admin.is_creator,
      role: "ADMIN",
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY_ADMIN,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  remove(id: number) {
    return this.prismaService.admin.delete({ where: { id } });
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    try {
      // Admin mavjudligini tekshiramiz
      const admin = await this.prismaService.admin.findUnique({
        where: { id },
      });

      if (!admin) {
        throw new NotFoundException("Admin topilmadi");
      }

      // Eski parolni tekshirish
      const isPasswordValid = await bcrypt.compare(
        updatePasswordDto.oldPassword,
        admin.password_hash
      );

      if (!isPasswordValid) {
        throw new NotFoundException("Eski parol noto'g'ri");
      }

      // Yangi parol bilan tasdiqlash parolini solishtirish
      if (
        updatePasswordDto.newPassword !== updatePasswordDto.confirmNewPassword
      ) {
        throw new NotFoundException("Yangi parollar mos kelmaydi");
      }

      // Eski parol bilan yangi parolni solishtirish
      const isSameAsOld = await bcrypt.compare(
        updatePasswordDto.newPassword,
        admin.password_hash
      );
      if (isSameAsOld) {
        throw new NotFoundException(
          "Yangi parol eski paroldan farqli bo'lishi kerak"
        );
      }

      // Yangi parolni hash qilish
      const hashedPassword = await bcrypt.hash(
        updatePasswordDto.newPassword,
        10
      );

      // Admin parolini yangilash
      const updatedAdmin = await this.prismaService.admin.update({
        where: { id },
        data: {
          password_hash: hashedPassword,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          phone: true,
          username: true,
          email: true,
          is_creator: true,
          image_url: true,
        },
      });

      return {
        message: "Parol muvaffaqiyatli yangilandi",
        data: updatedAdmin,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException("Parolni yangilashda xatolik yuz berdi");
    }
  }
}
