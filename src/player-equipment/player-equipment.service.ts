import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePlayerEquipmentDto, UpdatePlayerEquipmentDto } from "./dto";

@Injectable()
export class PlayerEquipmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPlayerEquipmentDto: CreatePlayerEquipmentDto) {
    return this.prismaService.playerEquipment.create({
      data: createPlayerEquipmentDto,
      include: {
        Player: true,
        Equipment: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.playerEquipment.findMany({
      include: {
        Player: true,
        Equipment: true,
      },
    });
  }

  async findOne(id: number) {
    const playerEquipment = await this.prismaService.playerEquipment.findUnique(
      {
        where: { id },
        include: {
          Player: true,
          Equipment: true,
        },
      }
    );

    if (!playerEquipment) {
      throw new NotFoundException("PlayerEquipment topilmadi");
    }

    return playerEquipment;
  }

  async update(id: number, updateData: Partial<CreatePlayerEquipmentDto>) {
    try {
      return await this.prismaService.playerEquipment.update({
        where: { id },
        data: updateData,
        include: {
          Player: true,
          Equipment: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.playerEquipment.delete({ where: { id } });
  }
}
