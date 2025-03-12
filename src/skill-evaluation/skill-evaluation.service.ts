import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSkillEvaluationDto, UpdateSkillEvaluationDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SkillEvaluationService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createSkillEvaluationDto: CreateSkillEvaluationDto) {
    return this.prismaService.skillEvaluation.create({
      data: createSkillEvaluationDto,
      include: {
        Skill: true,
        Coach: true,
        Player: true,
      },
    });
  }

  findAll() {
    return this.prismaService.skillEvaluation.findMany({
      include: {
        Skill: true,
        Coach: true,
        Player: true,
      },
    });
  }

  async findOne(id: number) {
    const skillEvaluation = await this.prismaService.skillEvaluation.findUnique(
      {
        where: { id },
        include: {
          Skill: true,
          Coach: true,
          Player: true,
        },
      }
    );
    if (!skillEvaluation)
      throw new NotFoundException("Skill baholash topilmadi");
    return skillEvaluation;
  }

  async update(id: number, updateSkillEvaluationDto: UpdateSkillEvaluationDto) {
    try {
      return await this.prismaService.skillEvaluation.update({
        where: { id },
        data: { ...updateSkillEvaluationDto },
        include: {
          Skill: true,
          Coach: true,
          Player: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.skillEvaluation.delete({ where: { id } });
  }
}
