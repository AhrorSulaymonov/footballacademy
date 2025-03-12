import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePlayerStatDto, UpdatePlayerStatDto } from "./dto";

@Injectable()
export class PlayerStatService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPlayerStatDto: CreatePlayerStatDto) {
    return this.prismaService.playerStat.create({
      data: createPlayerStatDto,
      include: {
        Player: true,
        Match: true,
        Position: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.playerStat.findMany({
      include: {
        Player: true,
        Match: true,
        Position: true,
      },
    });
  }

  async findOne(id: number) {
    const playerStat = await this.prismaService.playerStat.findUnique({
      where: { id },
      include: {
        Player: true,
        Match: true,
        Position: true,
      },
    });

    if (!playerStat) {
      throw new NotFoundException("PlayerStat topilmadi");
    }

    return playerStat;
  }

  async update(id: number, updateData: Partial<CreatePlayerStatDto>) {
    try {
      return await this.prismaService.playerStat.update({
        where: { id },
        data: updateData,
        include: {
          Player: true,
          Match: true,
          Position: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.playerStat.delete({ where: { id } });
  }
}
