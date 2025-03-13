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

  async findTopSkillScores() {
    try {
      const result = await this.prismaService.$queryRaw<
        { team_name: string; avg_skill_score: number }[]
      >`
        SELECT 
          t.name AS team_name,
          AVG(se.score) AS avg_skill_score
        FROM 
          teams t
        JOIN 
          players p ON p."teamId" = t.id
        JOIN 
          skill_evaluations se ON se."playerId" = p.id
        GROUP BY 
          t.name
        HAVING 
          COUNT(se.score) > 0
        ORDER BY 
          avg_skill_score DESC;
      `;
      return result;
    } catch (error) {
      throw new Error(
        "Jamoalarning o'rtacha malaka baholarini olishda xatolik yuz berdi"
      );
    }
  }
}
