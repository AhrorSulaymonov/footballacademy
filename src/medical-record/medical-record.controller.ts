import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  ParseIntPipe, // ID ni parse qilish va validatsiya qilish uchun
} from "@nestjs/common";
import { MedicalRecordService } from "./medical-record.service";
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth, // Autentifikatsiya uchun
} from "@nestjs/swagger";

@ApiTags("Medical-Record") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("medical-record")
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi tibbiy yozuv (medical record) yaratish" })
  @ApiBody({
    description: "Tibbiy yozuv yaratish uchun ma'lumotlar",
    type: CreateMedicalRecordDto, // CreateMedicalRecordDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Tibbiy yozuv muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (rol to'g'ri kelmadi).",
  })
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordService.create(createMedicalRecordDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha tibbiy yozuvlar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha tibbiy yozuvlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.medicalRecordService.findAll();
  }

  @Get("active-injuries")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Faol jarohatlar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Faol jarohatlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  getActiveInjuries() {
    return this.medicalRecordService.getActiveInjuries();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha tibbiy yozuv ma'lumotlarini olish" })
  @ApiParam({
    name: "id",
    description: "Tibbiy yozuvning unikal ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Tibbiy yozuv ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Tibbiy yozuv topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.medicalRecordService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha tibbiy yozuv ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan tibbiy yozuvning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateMedicalRecordDto,
    description: "Yangilanadigan tibbiy yozuv ma'lumotlari",
  }) // UpdateMedicalRecordDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Tibbiy yozuv muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Tibbiy yozuv topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto
  ) {
    return this.medicalRecordService.update(id, updateMedicalRecordDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha tibbiy yozuvni o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan tibbiy yozuvning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Tibbiy yozuv muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Tibbiy yozuv topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.medicalRecordService.remove(id); // +id o'rniga id
  }
}
