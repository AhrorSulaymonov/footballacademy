import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePositionDto, UpdatePositionDto } from "./dto";

@Injectable()
export class PositionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPositionDto: CreatePositionDto) {
    return this.prismaService.position.create({
      data: createPositionDto,
      include: {
        parentPosition: true,
        childPositions: true,
        playerStats: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.position.findMany({
      include: {
        parentPosition: true,
        childPositions: true,
        playerStats: true,
      },
    });
  }

  async findOne(id: number) {
    const position = await this.prismaService.position.findUnique({
      where: { id },
      include: {
        parentPosition: true,
        childPositions: true,
        playerStats: true,
      },
    });

    if (!position) {
      throw new NotFoundException("Position topilmadi");
    }

    return position;
  }

  async update(id: number, updateData: Partial<CreatePositionDto>) {
    try {
      return await this.prismaService.position.update({
        where: { id },
        data: updateData,
        include: {
          parentPosition: true,
          childPositions: true,
          playerStats: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.position.delete({ where: { id } });
  }
}
