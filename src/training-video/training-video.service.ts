import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTrainingVideoDto, UpdateTrainingVideoDto } from "./dto";

@Injectable()
export class TrainingVideoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTrainingVideoDto: CreateTrainingVideoDto) {
    return this.prismaService.trainingVideo.create({
      data: createTrainingVideoDto,
      include: {
        TrainingSession: true,
        Coach: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.trainingVideo.findMany({
      include: {
        TrainingSession: true,
        Coach: true,
      },
    });
  }

  async findOne(id: number) {
    const trainingVideo = await this.prismaService.trainingVideo.findUnique({
      where: { id },
      include: {
        TrainingSession: true,
        Coach: true,
      },
    });

    if (!trainingVideo) {
      throw new NotFoundException("TrainingVideo topilmadi");
    }

    return trainingVideo;
  }

  async update(id: number, updateTrainingVideoDto: UpdateTrainingVideoDto) {
    try {
      return await this.prismaService.trainingVideo.update({
        where: { id },
        data: updateTrainingVideoDto,
        include: {
          TrainingSession: true,
          Coach: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.trainingVideo.delete({ where: { id } });
  }
}
