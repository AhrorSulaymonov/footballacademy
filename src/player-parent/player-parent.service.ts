import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePlayerParentDto, UpdatePlayerParentDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PlayerParentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPlayerParentDto: CreatePlayerParentDto) {
    return this.prismaService.playerParent.create({
      data: createPlayerParentDto,
      include: { Parents: true, Player: true },
    });
  }

  findAll() {
    return this.prismaService.playerParent.findMany({
      include: { Parents: true, Player: true },
    });
  }

  async findOne(id: number) {
    const playerParent = await this.prismaService.playerParent.findUnique({
      where: { id },
      include: { Parents: true, Player: true },
    });
    if (!playerParent) throw new NotFoundException("PlayerParent topilmadi");
    return playerParent;
  }

  async update(id: number, updatePlayerParentDto: UpdatePlayerParentDto) {
    try {
      return await this.prismaService.playerParent.update({
        where: { id },
        data: { ...updatePlayerParentDto },
        include: { Parents: true, Player: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.playerParent.delete({ where: { id } });
  }
}
