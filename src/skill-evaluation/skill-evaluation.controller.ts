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
import { SkillEvaluationService } from "./skill-evaluation.service";
import { CreateSkillEvaluationDto, UpdateSkillEvaluationDto } from "./dto";
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

@ApiTags("Skill-Evaluation") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("skill-evaluation")
export class SkillEvaluationController {
  constructor(
    private readonly skillEvaluationService: SkillEvaluationService
  ) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi mahoratni baholash (skill evaluation) yaratish",
  })
  @ApiBody({
    description: "Mahoratni baholash uchun ma'lumotlar",
    type: CreateSkillEvaluationDto, // CreateSkillEvaluationDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Mahoratni baholash muvaffaqiyatli yaratildi.",
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
  create(@Body() createSkillEvaluationDto: CreateSkillEvaluationDto) {
    return this.skillEvaluationService.create(createSkillEvaluationDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha mahoratni baholashlar ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Barcha mahoratni baholashlar ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.skillEvaluationService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mahoratni baholash ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "Mahoratni baholashning unikal ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Mahoratni baholash ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mahoratni baholash topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.skillEvaluationService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mahoratni baholash ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan mahoratni baholashning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateSkillEvaluationDto,
    description: "Yangilanadigan mahoratni baholash ma'lumotlari",
  }) // UpdateSkillEvaluationDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Mahoratni baholash muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mahoratni baholash topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateSkillEvaluationDto: UpdateSkillEvaluationDto
  ) {
    return this.skillEvaluationService.update(id, updateSkillEvaluationDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha mahoratni baholashni o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan mahoratni baholashning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Mahoratni baholash muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mahoratni baholash topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.skillEvaluationService.remove(id); // +id o'rniga id
  }
}
