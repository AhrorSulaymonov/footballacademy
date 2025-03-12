import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateParentDto } from "./dto";
import { CreateParentDto } from "../user/dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ParentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createParentDto: CreateParentDto) {
    if (!createParentDto.userId) {
      throw new BadRequestException("userId bo'lishi zarur");
    }
    return this.prismaService.parent.create({
      data: {
        ...createParentDto,
        occupation: createParentDto.occupation ?? "Unknown",
        emergency_contact: createParentDto.emergency_contact,
      },
      include: { user: true, playerParents: true, feedbacks: true },
    });
  }

  findAll() {
    return this.prismaService.parent.findMany({
      include: { user: true, playerParents: true, feedbacks: true },
    });
  }

  async findOne(id: number) {
    const parent = await this.prismaService.parent.findUnique({
      where: { id },
      include: { user: true, playerParents: true, feedbacks: true },
    });
    if (!parent) throw new NotFoundException("Player topilmadi");
    return parent;
  }

  async update(id: number, updateParentDto: UpdateParentDto) {
    try {
      return await this.prismaService.parent.update({
        where: { id },
        data: { ...updateParentDto },
        include: { user: true, playerParents: true, feedbacks: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.parent.delete({ where: { id } });
  }
}
