import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateCoachDto } from "./dto";
import { CreateCoachDto } from "../user/dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CoachService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCoachDto: CreateCoachDto) {
    if (!createCoachDto.userId) {
      throw new BadRequestException("userId bo'lishi zarur");
    }
    return this.prismaService.coach.create({
      data: {
        ...createCoachDto,
        license_number: createCoachDto.license_number ?? "Unknown",
        specialization: createCoachDto.specialization ?? "GENERAL",
        hire_date: new Date(createCoachDto.hire_date),
      },
      include: {
        user: true,
        skillEvaluations: true,
        feedbacks: true,
        badges: true,
        coachTeams: true,
        trainingSessions: true,
        trainingVideos: true,
        attendances: true,
      },
    });
  }

  findAll() {
    return this.prismaService.coach.findMany({
      include: {
        user: true,
        skillEvaluations: true,
        feedbacks: true,
        badges: true,
        coachTeams: true,
        trainingSessions: true,
        trainingVideos: true,
        attendances: true,
      },
    });
  }

  async findOne(id: number) {
    const coach = await this.prismaService.coach.findUnique({
      where: { id },
      include: {
        user: true,
        skillEvaluations: true,
        feedbacks: true,
        badges: true,
        coachTeams: true,
        trainingSessions: true,
        trainingVideos: true,
        attendances: true,
      },
    });
    if (!coach) throw new NotFoundException("Player topilmadi");
    return coach;
  }

  async update(id: number, updateCoachDto: UpdateCoachDto) {
    try {
      return await this.prismaService.coach.update({
        where: { id },
        data: {
          ...updateCoachDto,
          hire_date: updateCoachDto.hire_date
            ? new Date(updateCoachDto.hire_date)
            : undefined, // agar qiymat kelmasa, eski qiymati saqlanadi
        },
        include: {
          user: true,
          skillEvaluations: true,
          feedbacks: true,
          badges: true,
          coachTeams: true,
          trainingSessions: true,
          trainingVideos: true,
          attendances: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.coach.delete({ where: { id } });
  }
}
