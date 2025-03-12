import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePlayerDto } from "../user/dto";
import { UpdatePlayerDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PlayerService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPlayerDto: CreatePlayerDto) {
    if (!createPlayerDto.userId) {
      throw new BadRequestException("userId bo'lishi zarur");
    }
    return this.prismaService.player.create({
      data: {
        ...createPlayerDto,
        date_of_birth: new Date(createPlayerDto.date_of_birth),
        height: createPlayerDto.height ?? 0,
        weight: createPlayerDto.weight ?? 0,
        preferred_foot: createPlayerDto.preferred_foot ?? "RIGHT",
        medical_notes: createPlayerDto.medical_notes ?? "No notes",
        main_position: createPlayerDto.main_position ?? "MIDFIELD",
        teamId: createPlayerDto.teamId ?? null,
      },
      include: {
        user: true,
        playerParents: true,
        medicalRecords: true,
        skillEvaluations: true,
        feedbacks: true,
        badges: true,
        playerEquipments: true,
        playerStats: true,
        attendances: true,
      },
    });
  }

  findAll() {
    return this.prismaService.player.findMany({
      include: {
        user: true,
        playerParents: true,
        medicalRecords: true,
        skillEvaluations: true,
        feedbacks: true,
        badges: true,
        playerEquipments: true,
        playerStats: true,
        attendances: true,
      },
    });
  }

  async findOne(id: number) {
    const player = await this.prismaService.player.findUnique({
      where: { id },
      include: {
        user: true,
        playerParents: true,
        medicalRecords: true,
        skillEvaluations: true,
        feedbacks: true,
        badges: true,
        playerEquipments: true,
        playerStats: true,
        attendances: true,
      },
    });
    if (!player) throw new NotFoundException("Player topilmadi");
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      return await this.prismaService.player.update({
        where: { id },
        data: {
          ...updatePlayerDto,
          date_of_birth: updatePlayerDto.date_of_birth
            ? new Date(updatePlayerDto.date_of_birth)
            : undefined,
        },
        include: {
          user: true,
          playerParents: true,
          medicalRecords: true,
          skillEvaluations: true,
          feedbacks: true,
          badges: true,
          playerEquipments: true,
          playerStats: true,
          attendances: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.player.delete({ where: { id } });
  }

  async findTopGoalScorers(limit?: string) {
    const limitValue = parseInt(limit ?? "5") || 5; // undefined bo'lsa "5", noto'g'ri string bo'lsa 5
    try {
      const topPlayers = await this.prismaService.playerStat.groupBy({
        by: ["playerId"],
        _sum: {
          goals: true,
        },
        orderBy: {
          _sum: {
            goals: "desc",
          },
        },
        take: limitValue,
      });

      const playerIds: number[] = topPlayers.map((stat) => stat.playerId!);

      if (playerIds.length === 0) {
        return [];
      }

      const players = await this.prismaService.player.findMany({
        where: {
          id: { in: playerIds },
        },
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      const result = topPlayers.map((stat) => {
        const player = players.find((p) => p.id === stat.playerId);
        if (!player) {
          throw new NotFoundException(
            `Player with ID ${stat.playerId} not found`
          );
        }
        return {
          playerName: `${player.user.first_name} ${player.user.last_name || ""}`,
          totalGoals: stat._sum.goals,
        };
      });

      return result;
    } catch (error) {
      throw new BadRequestException(
        "Top goal scorers ni olishda xatolik yuz berdi"
      );
    }
  }
}
