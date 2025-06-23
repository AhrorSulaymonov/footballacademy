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
import { TrainingSessionService } from "./training-session.service";
import { CreateTrainingSessionDto, UpdateTrainingSessionDto } from "./dto";
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

@ApiTags("Training-Session") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("training-session")
export class TrainingSessionController {
  constructor(
    private readonly trainingSessionService: TrainingSessionService
  ) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi mashg'ulot sessiyasi (training session) yaratish",
  })
  @ApiBody({
    description: "Mashg'ulot sessiyasi yaratish uchun ma'lumotlar",
    type: CreateTrainingSessionDto, // CreateTrainingSessionDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Mashg'ulot sessiyasi muvaffaqiyatli yaratildi.",
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
  create(@Body() createTrainingSessionDto: CreateTrainingSessionDto) {
    return this.trainingSessionService.create(createTrainingSessionDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha mashg'ulot sessiyalari ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Barcha mashg'ulot sessiyalari ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.trainingSessionService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mashg'ulot sessiyasi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "Mashg'ulot sessiyasining unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Mashg'ulot sessiyasi ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mashg'ulot sessiyasi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.trainingSessionService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mashg'ulot sessiyasi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan mashg'ulot sessiyasining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateTrainingSessionDto,
    description: "Yangilanadigan mashg'ulot sessiyasi ma'lumotlari",
  }) // UpdateTrainingSessionDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Mashg'ulot sessiyasi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mashg'ulot sessiyasi topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateTrainingSessionDto: UpdateTrainingSessionDto
  ) {
    return this.trainingSessionService.update(id, updateTrainingSessionDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha mashg'ulot sessiyasini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan mashg'ulot sessiyasining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Mashg'ulot sessiyasi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mashg'ulot sessiyasi topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.trainingSessionService.remove(id); // +id o'rniga id
  }
}
