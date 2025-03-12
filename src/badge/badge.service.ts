import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBadgeDto, UpdateBadgeDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import { FileAmazonService } from "../file-amazon/file-amazon.service";

@Injectable()
export class BadgeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileAmazonService: FileAmazonService
  ) {}

  async create(createBadgeDto: CreateBadgeDto, image: Express.Multer.File) {
    try {
      // Rasm yuklash
      const fileUrl = await this.fileAmazonService.uploadFile(image);

      return this.prismaService.badge.create({
        data: {
          ...createBadgeDto,
          awarded_date: new Date(createBadgeDto.awarded_date),
          image_url: fileUrl,
          playerId: +createBadgeDto.playerId, // String bo‘lsa numberga o‘tadi
          coachId: +createBadgeDto.coachId, // String bo‘lsa numberga o‘tadi
        },
        include: {
          Player: true,
          Coach: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.prismaService.badge.findMany({
      include: {
        Player: true,
        Coach: true,
      },
    });
  }

  async findOne(id: number) {
    const badge = await this.prismaService.badge.findUnique({
      where: { id },
      include: {
        Player: true,
        Coach: true,
      },
    });
    if (!badge) throw new NotFoundException("Badge topilmadi");
    return badge;
  }

  async update(id: number, updateBadgeDto: UpdateBadgeDto) {
    try {
      return await this.prismaService.badge.update({
        where: { id },
        data: {
          ...updateBadgeDto,
          awarded_date: updateBadgeDto.awarded_date
            ? new Date(updateBadgeDto.awarded_date)
            : undefined, // agar qiymat kelmasa, eski qiymati saqlanadi
        },
        include: {
          Player: true,
          Coach: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.badge.delete({ where: { id } });
  }
}
