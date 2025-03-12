import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    return this.prismaService.feedback.create({
      data: {
        ...createFeedbackDto,
      },
      include: {
        Coach: true,
        Parent: true,
        Player: true,
      },
    });
  }

  findAll() {
    return this.prismaService.feedback.findMany({
      include: {
        Coach: true,
        Parent: true,
        Player: true,
      },
    });
  }

  async findOne(id: number) {
    const feedback = await this.prismaService.feedback.findUnique({
      where: { id },
      include: {
        Coach: true,
        Parent: true,
        Player: true,
      },
    });
    if (!feedback) throw new NotFoundException("Feedback topilmadi");
    return feedback;
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    try {
      return await this.prismaService.feedback.update({
        where: { id },
        data: { ...updateFeedbackDto },
        include: {
          Coach: true,
          Parent: true,
          Player: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.feedback.delete({ where: { id } });
  }
}
