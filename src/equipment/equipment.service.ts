import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEquipmentDto, UpdateEquipmentDto } from "./dto";

@Injectable()
export class EquipmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    return this.prismaService.equipment.create({
      data: {
        ...createEquipmentDto,
        last_maintenance: new Date(createEquipmentDto.last_maintenance),
      },
      include: {
        teamEquipments: true,
        playerEquipments: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.equipment.findMany({
      include: {
        teamEquipments: true,
        playerEquipments: true,
      },
    });
  }

  async findOne(id: number) {
    const equipment = await this.prismaService.equipment.findUnique({
      where: { id },
      include: {
        teamEquipments: true,
        playerEquipments: true,
      },
    });

    if (!equipment) {
      throw new NotFoundException("Equipment topilmadi");
    }

    return equipment;
  }

  async update(id: number, updateData: Partial<CreateEquipmentDto>) {
    try {
      return await this.prismaService.equipment.update({
        where: { id },
        data: {
          ...updateData,
          last_maintenance: updateData.last_maintenance
            ? new Date(updateData.last_maintenance)
            : undefined, // agar qiymat kelmasa, eski qiymati saqlanadi
        },
        include: {
          teamEquipments: true,
          playerEquipments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.equipment.delete({ where: { id } });
  }
}
