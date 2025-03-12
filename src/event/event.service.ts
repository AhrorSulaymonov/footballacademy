import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto, UpdateEventDto } from "./dto";

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        event_date: new Date(createEventDto.event_date),
      },
      include: {
        Admin: true,
        eventRegistrations: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.event.findMany({
      include: {
        Admin: true,
        eventRegistrations: true,
      },
    });
  }

  async findOne(id: number) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
      include: {
        Admin: true,
        eventRegistrations: true,
      },
    });

    if (!event) {
      throw new NotFoundException("Event topilmadi");
    }

    return event;
  }

  async update(id: number, updateData: Partial<CreateEventDto>) {
    try {
      return await this.prismaService.event.update({
        where: { id },
        data: {
          ...updateData,
          event_date: updateData.event_date
            ? new Date(updateData.event_date)
            : undefined, // agar qiymat kelmasa, eski qiymati saqlanadi
        },
        include: {
          Admin: true,
          eventRegistrations: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.event.delete({ where: { id } });
  }
}
