import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCoachTeamDto, UpdateCoachTeamDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CoachTeamService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCoachTeamDto: CreateCoachTeamDto) {
    return this.prismaService.coachTeam.create({
      data: createCoachTeamDto,
      include: {
        Coach: true,
        Team: true,
      },
    });
  }

  findAll() {
    return this.prismaService.coachTeam.findMany({
      include: {
        Coach: true,
        Team: true,
      },
    });
  }

  async findOne(id: number) {
    const coachTeam = await this.prismaService.coachTeam.findUnique({
      where: { id },
      include: {
        Coach: true,
        Team: true,
      },
    });
    if (!coachTeam) throw new NotFoundException("Team topilmadi");
    return coachTeam;
  }

  async update(id: number, updateCoachTeamDto: UpdateCoachTeamDto) {
    try {
      return await this.prismaService.coachTeam.update({
        where: { id },
        data: { ...updateCoachTeamDto },
        include: {
          Coach: true,
          Team: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.coachTeam.delete({ where: { id } });
  }
}
