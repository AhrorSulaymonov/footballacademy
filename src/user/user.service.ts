import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { FileAmazonService } from "../file-amazon/file-amazon.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Tokens } from "../common/types";
import * as uuid from "uuid";
import { MailService } from "../mail/mail.service";
import { UpdateUserPasswordDto } from "./dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly fileAmazonService: FileAmazonService
  ) {}
  async create(createUserDto: CreateUserDto, image: Express.Multer.File) {
    try {
      const {
        password,
        confirm_password,
        role,
        email,
        phone,
        playerData,
        parentData,
        coachData,
        ...data
      } = createUserDto;

      // Parollarni tekshirish
      if (password !== confirm_password) {
        throw new BadRequestException("Parollar mos emas");
      }

      // Mavjud foydalanuvchini tekshirish
      const existingUser = await this.prismaService.user.findFirst({
        where: { OR: [{ email }, { phone }] },
      });

      if (existingUser) {
        throw new ConflictException(
          "Email yoki telefon raqam allaqachon mavjud"
        );
      }

      // Agar rasm bo‘lsa, yuklash
      const fileUrl = image
        ? await this.fileAmazonService.uploadFile(image)
        : null;

      // Parolni hash qilish
      const password_hash = await bcrypt.hash(password, 7);

      return await this.prismaService.$transaction(async (prisma) => {
        let extraData = {};

        // Role bo‘yicha qo‘shimcha ma’lumotlarni tekshirish va qo‘shish
        switch (role) {
          case "PLAYER":
            if (!playerData) {
              throw new BadRequestException("Player ma’lumotlari kiritilmagan");
            }

            // JSON string bo‘lsa, uni obyektga o‘tkazish
            const parsedPlayerData =
              typeof playerData === "string"
                ? JSON.parse(playerData)
                : playerData;

            if (!parsedPlayerData.date_of_birth) {
              throw new BadRequestException(
                "Player uchun date_of_birth maydoni kerak"
              );
            }
            extraData = {
              player: {
                create: {
                  date_of_birth: new Date(parsedPlayerData.date_of_birth),
                  height: parsedPlayerData.height ?? 0,
                  weight: parsedPlayerData.weight ?? 0,
                  preferred_foot: parsedPlayerData.preferred_foot ?? "RIGHT",
                  medical_notes: parsedPlayerData.medical_notes ?? "No notes",
                  main_position: parsedPlayerData.main_position ?? "MIDFIELDER",
                  teamId: parsedPlayerData.teamId ?? null,
                },
              },
            };
            break;

          case "PARENT":
            if (!parentData) {
              throw new BadRequestException("Parent ma’lumotlari kiritilmagan");
            }

            // JSON string bo‘lsa, uni obyektga o‘tkazish
            const parsedParentData =
              typeof parentData === "string"
                ? JSON.parse(parentData)
                : parentData;

            extraData = {
              parent: {
                create: {
                  occupation: parsedParentData.occupation ?? "Unknown",
                  emergency_contact: parsedParentData.emergency_contact,
                },
              },
            };
            break;

          case "COACH":
            if (!coachData) {
              throw new BadRequestException("Coach ma’lumotlari kiritilmagan");
            }

            // JSON string bo‘lsa, uni obyektga o‘tkazish
            const parsedCoachData =
              typeof coachData === "string" ? JSON.parse(coachData) : coachData;

            if (!parsedCoachData.hire_date) {
              throw new BadRequestException(
                "Coach uchun hire_date maydoni kerak"
              );
            }

            extraData = {
              coach: {
                create: {
                  license_number: parsedCoachData.license_number ?? "Unknown",
                  specialization: parsedCoachData.specialization ?? "GENERAL",
                  hire_date: new Date(parsedCoachData.hire_date),
                },
              },
            };
            break;

          default:
            throw new BadRequestException("Noto‘g‘ri role kiritildi");
        }

        const verification = uuid.v4();
        // Foydalanuvchini yaratish
        const user = await prisma.user.create({
          data: {
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            email,
            phone,
            password_hash,
            role,
            image_url: fileUrl,
            verification,
            ...extraData,
          },
          include: {
            player: role === "PLAYER",
            parent: role === "PARENT",
            coach: role === "COACH",
          },
        });
        
        try {
          await this.mailService.sendMail(user);
        } catch (error) {
          throw new InternalServerErrorException("Xat yuborishda xatolik");
        }
        return user;
      });
    } catch (error) {
      console.error("Foydalanuvchi yaratishda xatolik:", error);
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async updateRefreshToken(
    id: number,
    hashed_refresh_token: string | undefined
  ) {
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { refresh_token_hashed: hashed_refresh_token },
    });
    return updatedUser;
  }

  findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { parent: true, player: true, coach: true },
    });
  }

  async getTokens(user: any): Promise<Tokens> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      roleId: user.coach?.id || user.player?.id || user.parent?.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY!,
        expiresIn: process.env.ACCESS_TOKEN_TIME!,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY!,
        expiresIn: process.env.REFRESH_TOKEN_TIME!,
      }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async uploadImage(id: number, image: Express.Multer.File) {
    try {
      // Rasm yuklash
      const fileUrl = await this.fileAmazonService.uploadFile(image);
      return await this.prismaService.user.update({
        where: { id },
        data: { image_url: fileUrl },
        include: { player: true, parent: true, coach: true },
      });
    } catch (error) {
      throw error;
    }
  }
  findAll() {
    return this.prismaService.user.findMany({
      include: { player: true, parent: true, coach: true },
    });
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { player: true, parent: true, coach: true },
    });

    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: { ...updateUserDto },
        include: { player: true, parent: true, coach: true },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new BadRequestException("Email yoki telefon raqam band");
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Foydalanuvchi mavjudligini tekshirish
    return this.prismaService.user.delete({ where: { id } });
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }

    try {
      const updateUser = await this.prismaService.user.update({
        where: {
          verification: link,
          is_active: false, // Faqat aktivlanmagan foydalanuvchini tanlash
        },
        data: {
          is_active: true,
        },
        select: {
          id: true,
          is_active: true,
        },
      });

      return {
        message: "User activated successfully",
        user: updateUser,
      };
    } catch (error) {
      throw new BadRequestException("User already activated or not found");
    }
  }

  async updatePassword(id: number, updatePasswordDto: UpdateUserPasswordDto) {
    const { old_password, new_password, confirm_new_password } =
      updatePasswordDto;

    // 1. Foydalanuvchini topish
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Foydalanuvchi topilmadi");
    }

    // 2. Eski parolni tekshirish
    const passwordMatches = await bcrypt.compare(
      old_password,
      user.password_hash
    );
    if (!passwordMatches) {
      throw new BadRequestException("Eski parol noto‘g‘ri");
    }

    // 3. Yangi parollar mosligini tekshirish
    if (new_password !== confirm_new_password) {
      throw new BadRequestException("Yangi parollar mos emas");
    }

    // 4. Yangi parolni hash qilish
    const newHashedPassword = await bcrypt.hash(new_password, 7);

    // 5. Parolni yangilash
    await this.prismaService.user.update({
      where: { id },
      data: { password_hash: newHashedPassword },
    });

    return { message: "Parol muvaffaqiyatli yangilandi" };
  }
}
