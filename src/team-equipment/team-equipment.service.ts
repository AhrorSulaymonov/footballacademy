import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTeamEquipmentDto, UpdateTeamEquipmentDto } from "./dto";

@Injectable()
export class TeamEquipmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTeamEquipmentDto: CreateTeamEquipmentDto) {
    return this.prismaService.teamEquipment.create({
      data: createTeamEquipmentDto,
      include: {
        Team: true,
        Equipment: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.teamEquipment.findMany({
      include: {
        Team: true,
        Equipment: true,
      },
    });
  }

  async findOne(id: number) {
    const teamEquipment = await this.prismaService.teamEquipment.findUnique({
      where: { id },
      include: {
        Team: true,
        Equipment: true,
      },
    });

    if (!teamEquipment) {
      throw new NotFoundException("TeamEquipment topilmadi");
    }

    return teamEquipment;
  }

  async update(id: number, updateData: Partial<CreateTeamEquipmentDto>) {
    try {
      return await this.prismaService.teamEquipment.update({
        where: { id },
        data: updateData,
        include: {
          Team: true,
          Equipment: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.teamEquipment.delete({ where: { id } });
  }
}
