import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSkillDto, UpdateSkillDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SkillService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createSkillDto: CreateSkillDto) {
    
  }

  findAll() {
    return this.prismaService.skill.findMany({
      include: {
        SkillCategory: true,
      },
    });
  }

  async findOne(id: number) {
    const skill = await this.prismaService.skill.findUnique({
      where: { id },
      include: {
        SkillCategory: true,
      },
    });
    if (!skill) throw new NotFoundException("Skill topilmadi");
    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    try {
      return await this.prismaService.skill.update({
        where: { id },
        data: { ...updateSkillDto },
        include: {
          SkillCategory: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.skill.delete({ where: { id } });
  }
}
