import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAttendanceDto, UpdateAttendanceDto } from "./dto";

@Injectable()
export class AttendanceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    return this.prismaService.attendance.create({
      data: createAttendanceDto,
      include: {
        TrainingSession: true,
        Player: true,
        Coach: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.attendance.findMany({
      include: {
        TrainingSession: true,
        Player: true,
        Coach: true,
      },
    });
  }

  async findOne(id: number) {
    const attendance = await this.prismaService.attendance.findUnique({
      where: { id },
      include: {
        TrainingSession: true,
        Player: true,
        Coach: true,
      },
    });

    if (!attendance) {
      throw new NotFoundException("Attendance topilmadi");
    }

    return attendance;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      return await this.prismaService.attendance.update({
        where: { id },
        data: updateAttendanceDto,
        include: {
          TrainingSession: true,
          Player: true,
          Coach: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.attendance.delete({ where: { id } });
  }
}
