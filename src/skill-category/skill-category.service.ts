import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSkillCategoryDto, UpdateSkillCategoryDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SkillCategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createSkillCategoryDto: CreateSkillCategoryDto) {
    return this.prismaService.skillCategory.create({
      data: createSkillCategoryDto,
      include: {
        skills: true,
      },
    });
  }

  findAll() {
    return this.prismaService.skillCategory.findMany({
      include: {
        skills: true,
      },
    });
  }

  async findOne(id: number) {
    const skillCategory = await this.prismaService.skillCategory.findUnique({
      where: { id },
      include: {
        skills: true,
      },
    });
    if (!skillCategory) throw new NotFoundException("Skill category topilmadi");
    return skillCategory;
  }

  async update(id: number, updateSkillCategoryDto: UpdateSkillCategoryDto) {
    try {
      return await this.prismaService.skillCategory.update({
        where: { id },
        data: { ...updateSkillCategoryDto },
        include: {
          skills: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.skillCategory.delete({ where: { id } });
  }
}
