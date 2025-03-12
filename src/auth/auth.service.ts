import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { SignupAdminDto, SignInAdminDto } from "../admin/dto";
import { AdminService } from "../admin/admin.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { ResponseFields, Tokens } from "../common/types";
import { CreateUserDto, SignInUserDto } from "../user/dto";
import { UserService } from "../user/user.service";
import { use } from "passport";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async signUpAdmin(
    createAdminDto: SignupAdminDto,
    image: Express.Multer.File
  ) {
    const candidate = await this.adminService.findAdminByEmail(
      createAdminDto.email
    );

    if (candidate) {
      throw new BadRequestException("Bunday foydalanuvchi mavjud");
    }

    const newAdmin = await this.adminService.create(createAdminDto, image);

    const response = {
      message: "Tabriklayman admin tizimga qo'shildi",
      adminId: newAdmin.id,
    };
    return response;
  }

  async signUp(createUserDto: CreateUserDto, image: Express.Multer.File) {
    const newUser = await this.userService.create(createUserDto, image);
    const response = {
      message: "Tabriklayman tizimga qo'shildingiz",
      adminId: newUser.id,
    };
    return response;
  }

  async signInAdmin(signInDto: SignInAdminDto, res: Response) {
    const { email, password } = signInDto;
    const admin = await this.adminService.findAdminByEmail(email);
    if (!admin) {
      throw new BadRequestException("Bunday foydalanuvchi mavjud emas");
    }
    const isMatchPass = await bcrypt.compare(password, admin.password_hash);
    if (!isMatchPass) {
      throw new BadRequestException("Password do not match");
    }

    const tokens = await this.adminService.getTokens(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updateAdmin = await this.adminService.updateRefreshToken(
      admin.id,
      hashed_refresh_token
    );
    if (!updateAdmin) {
      throw new InternalServerErrorException("Tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "Admin logged in",
      adminId: admin.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signIn(
    signInDto: SignInUserDto,
    res: Response
  ): Promise<ResponseFields> {
    const { email, password } = signInDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { parent: true, player: true, coach: true }, // ⚡️ Barcha kerakli maydonlarni qo‘shdik
    });

    if (!user) {
      throw new BadRequestException("Bunday foydalanuvchi mavjud emas");
    }

    const isMatchPass = await bcrypt.compare(password, user.password_hash);
    if (!isMatchPass) {
      throw new BadRequestException("Password do not match");
    }

    const tokens = await this.userService.getTokens(user); // 🛑 Bazaga qayta so‘rov yubormaymiz!

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.userService.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return { id: user.id, access_token: tokens.access_token };
  }

  async signOutAdmin(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
    });

    if (!adminData) {
      throw new ForbiddenException("Admin not verified");
    }

    const hashed_refresh_token = null;

    await this.adminService.updateRefreshToken(
      adminData.id,
      hashed_refresh_token
    );

    res.clearCookie("refresh_token");
    const response = {
      message: "Admin logged out successfully",
    };
    return response;
  }

  async refreshTokenAdmin(
    adminId: number,
    refreshToken: string,
    res: Response
  ): Promise<ResponseFields> {
    const decodedToken = await this.jwtService.decode(refreshToken);

    if (adminId !== decodedToken["id"]) {
      throw new BadRequestException("Ruxsat etilmagan");
    }

    const admin = await this.adminService.findOne(adminId);

    if (!admin || !admin.refresh_token_hashed) {
      throw new BadRequestException("admin not found");
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      admin.refresh_token_hashed
    );
    if (!tokenMatch) {
      throw new ForbiddenException("Forbiddin");
    }

    const tokens = await this.adminService.getTokens(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.adminService.updateRefreshToken(admin.id, hashed_refresh_token);
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      id: admin.id,
      access_token: tokens.access_token,
    };

    return response;
  }

  async signOut(userId: number, res: Response) {
    const user = await this.prismaService.user.updateMany({
      where: {
        id: userId,
        refresh_token_hashed: {
          not: undefined,
        },
      },
      data: {
        refresh_token_hashed: undefined,
      },
    });
    const hashed_refresh_token = null;

    res.clearCookie("refresh_token");
    const response = {
      message: "User logged out successfully",
    };
    return response;
  }

  async refreshToken(
    userId: number,
    refreshToken: string,
    res: Response
  ): Promise<ResponseFields> {
    const decodedToken = await this.jwtService.decode(refreshToken);

    if (userId !== decodedToken["id"]) {
      throw new BadRequestException("Ruxsat etilmagan");
    }

    const user = await this.userService.findOne(userId);

    if (!user || !user.refresh_token_hashed) {
      throw new BadRequestException("User not found");
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hashed
    );
    if (!tokenMatch) {
      throw new ForbiddenException("Forbiddin");
    }

    const tokens = await this.userService.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.userService.updateRefreshToken(user.id, hashed_refresh_token);
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      id: user.id,
      access_token: tokens.access_token,
    };

    return response;
  }
}
