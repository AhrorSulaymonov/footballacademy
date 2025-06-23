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
import { TrainingVideoService } from "./training-video.service";
import { CreateTrainingVideoDto, UpdateTrainingVideoDto } from "./dto";
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

@ApiTags("Training-Video") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("training-video")
export class TrainingVideoController {
  constructor(private readonly trainingVideoService: TrainingVideoService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi mashg'ulot videosi (training video) yaratish",
  })
  @ApiBody({
    description: "Mashg'ulot videosi yaratish uchun ma'lumotlar",
    type: CreateTrainingVideoDto, // CreateTrainingVideoDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Mashg'ulot videosi muvaffaqiyatli yaratildi.",
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
  create(@Body() createTrainingVideoDto: CreateTrainingVideoDto) {
    return this.trainingVideoService.create(createTrainingVideoDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha mashg'ulot videolari ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Barcha mashg'ulot videolari ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.trainingVideoService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mashg'ulot videosi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "Mashg'ulot videosining unikal ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Mashg'ulot videosi ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mashg'ulot videosi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.trainingVideoService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mashg'ulot videosi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan mashg'ulot videosining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateTrainingVideoDto,
    description: "Yangilanadigan mashg'ulot videosi ma'lumotlari",
  }) // UpdateTrainingVideoDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Mashg'ulot videosi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mashg'ulot videosi topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateTrainingVideoDto: UpdateTrainingVideoDto
  ) {
    return this.trainingVideoService.update(id, updateTrainingVideoDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha mashg'ulot videosini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan mashg'ulot videosining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Mashg'ulot videosi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mashg'ulot videosi topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.trainingVideoService.remove(id); // +id o'rniga id
  }
}
