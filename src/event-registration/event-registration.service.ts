import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventRegistrationDto } from "./dto/create-event-registration.dto";

@Injectable()
export class EventRegistrationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventRegistrationDto: CreateEventRegistrationDto) {
    return this.prismaService.eventRegistration.create({
      data: {
        Event: createEventRegistrationDto.eventId
          ? { connect: { id: createEventRegistrationDto.eventId } }
          : undefined,
        User: createEventRegistrationDto.userId
          ? { connect: { id: createEventRegistrationDto.userId } }
          : undefined,
        status: createEventRegistrationDto.status,
        registration_date: createEventRegistrationDto.registration_date
          ? new Date(createEventRegistrationDto.registration_date)
          : undefined,
      },
      include: {
        Event: true,
        User: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.eventRegistration.findMany({
      include: {
        Event: true,
        User: true,
      },
    });
  }

  async findOne(id: number) {
    const eventRegistration =
      await this.prismaService.eventRegistration.findUnique({
        where: { id },
        include: {
          Event: true,
          User: true,
        },
      });

    if (!eventRegistration) {
      throw new NotFoundException("EventRegistration topilmadi");
    }

    return eventRegistration;
  }

  async update(id: number, updateData: Partial<CreateEventRegistrationDto>) {
    try {
      return await this.prismaService.eventRegistration.update({
        where: { id },
        data: {
          ...updateData,
          registration_date: updateData.registration_date
            ? new Date(updateData.registration_date)
            : undefined, // agar qiymat kelmasa, eski qiymati saqlanadi
        },
        include: {
          Event: true,
          User: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.eventRegistration.delete({ where: { id } });
  }
}
