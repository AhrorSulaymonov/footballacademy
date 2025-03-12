import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTrainingSessionDto, UpdateTrainingSessionDto } from "./dto";

@Injectable()
export class TrainingSessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTrainingSessionDto: CreateTrainingSessionDto) {
    return this.prismaService.trainingSession.create({
      data: {
        ...createTrainingSessionDto,
        session_date: new Date(createTrainingSessionDto.session_date),
      },
      include: {
        Team: true,
        Coach: true,
        trainingVideos: true,
        attendances: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.trainingSession.findMany({
      include: {
        Team: true,
        Coach: true,
        trainingVideos: true,
        attendances: true,
      },
    });
  }

  async findOne(id: number) {
    const trainingSession = await this.prismaService.trainingSession.findUnique(
      {
        where: { id },
        include: {
          Team: true,
          Coach: true,
          trainingVideos: true,
          attendances: true,
        },
      }
    );

    if (!trainingSession) {
      throw new NotFoundException("TrainingSession topilmadi");
    }

    return trainingSession;
  }

  async update(id: number, updateTrainingSessionDto: UpdateTrainingSessionDto) {
    try {
      return await this.prismaService.trainingSession.update({
        where: { id },
        data: {
          ...updateTrainingSessionDto,
          session_date: updateTrainingSessionDto.session_date
            ? new Date(updateTrainingSessionDto.session_date)
            : undefined, // agar qiymat kelmasa, eski qiymati saqlanadi
        },
        include: {
          Team: true,
          Coach: true,
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
    return this.prismaService.trainingSession.delete({ where: { id } });
  }
}
