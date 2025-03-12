import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMatchDto, UpdateMatchDto } from "./dto";

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    return this.prismaService.match.create({
      data: {
        ...createMatchDto,
        match_date: new Date(createMatchDto.match_date),
      },
      include: {
        Team: true,
        playerStats: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.match.findMany({
      include: {
        Team: true,
        playerStats: true,
      },
    });
  }

  async findOne(id: number) {
    const match = await this.prismaService.match.findUnique({
      where: { id },
      include: {
        Team: true,
        playerStats: true,
      },
    });

    if (!match) {
      throw new NotFoundException("Match topilmadi");
    }

    return match;
  }

  async update(id: number, updateData: Partial<CreateMatchDto>) {
    try {
      return await this.prismaService.match.update({
        where: { id },
        data: {
          ...updateData,
          match_date: updateData.match_date
            ? new Date(updateData.match_date)
            : undefined, // agar qiymat kelmasa, eski qiymati saqlanadi
        },
        include: {
          Team: true,
          playerStats: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.match.delete({ where: { id } });
  }
}
