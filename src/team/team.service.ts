import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTeamDto, UpdateTeamDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTeamDto: CreateTeamDto) {
    return this.prismaService.team.create({
      data: createTeamDto,
      include: {
        players: true,
        coachTeams: true,
        trainingSessions: true,
        teamEquipments: true,
        matches: true,
      },
    });
  }

  findAll() {
    return this.prismaService.team.findMany({
      include: {
        players: true,
        coachTeams: true,
        trainingSessions: true,
        teamEquipments: true,
        matches: true,
      },
    });
  }

  async findOne(id: number) {
    const team = await this.prismaService.team.findUnique({
      where: { id },
      include: {
        players: true,
        coachTeams: true,
        trainingSessions: true,
        teamEquipments: true,
        matches: true,
      },
    });
    if (!team) throw new NotFoundException("Team topilmadi");
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    try {
      return await this.prismaService.team.update({
        where: { id },
        data: { ...updateTeamDto },
        include: {
          players: true,
          coachTeams: true,
          trainingSessions: true,
          teamEquipments: true,
          matches: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.team.delete({ where: { id } });
  }
}
