import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MedicalRecordService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.prismaService.medicalRecord.create({
      data: {
        ...createMedicalRecordDto,
        diagnosis_date: new Date(createMedicalRecordDto.diagnosis_date),
      },
      include: {
        Player: true,
      },
    });
  }

  findAll() {
    return this.prismaService.medicalRecord.findMany({
      include: {
        Player: true,
      },
    });
  }

  async findOne(id: number) {
    const medicalRecord = await this.prismaService.medicalRecord.findUnique({
      where: { id },
      include: {
        Player: true,
      },
    });
    if (!medicalRecord) throw new NotFoundException("Medical record topilmadi");
    return medicalRecord;
  }

  async update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    try {
      return await this.prismaService.medicalRecord.update({
        where: { id },
        data: {
          ...updateMedicalRecordDto,
          diagnosis_date: updateMedicalRecordDto.diagnosis_date
            ? new Date(updateMedicalRecordDto.diagnosis_date)
            : undefined,
        },
        include: {
          Player: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.medicalRecord.delete({ where: { id } });
  }

  async getActiveInjuries() {
    try {
      const result = await this.prismaService.$queryRaw<
        {
          player_name: string;
          injury_type: string;
          diagnosis_date: Date;
          doctor_notes: string;
        }[]
      >`
        SELECT 
          u.first_name || ' ' || COALESCE(u.last_name, '') AS player_name,
          mr.injury_type,
          mr.diagnosis_date,
          mr.doctor_notes
        FROM 
          medical_records mr
        JOIN 
          players p ON mr."playerId" = p.id
        JOIN 
          users u ON p."userId" = u.id
        WHERE 
          mr.recovery_status = 'active'
        ORDER BY 
          mr.diagnosis_date DESC;
      `;
      return result;
    } catch (error) {
      throw new NotFoundException(
        "Faol jarohatlarni olishda xatolik yuz berdi"
      );
    }
  }
}
