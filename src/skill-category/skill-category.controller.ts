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
import { SkillCategoryService } from "./skill-category.service";
import { CreateSkillCategoryDto, UpdateSkillCategoryDto } from "./dto";
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

@ApiTags("Skill-Category") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("skill-category")
export class SkillCategoryController {
  constructor(private readonly skillCategoryService: SkillCategoryService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi mahorat kategoriyasi (skill category) yaratish",
  })
  @ApiBody({
    description: "Mahorat kategoriyasi yaratish uchun ma'lumotlar",
    type: CreateSkillCategoryDto, // CreateSkillCategoryDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Mahorat kategoriyasi muvaffaqiyatli yaratildi.",
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
  create(@Body() createSkillCategoryDto: CreateSkillCategoryDto) {
    return this.skillCategoryService.create(createSkillCategoryDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha mahorat kategoriyalari ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Barcha mahorat kategoriyalari ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.skillCategoryService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mahorat kategoriyasi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "Mahorat kategoriyasining unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Mahorat kategoriyasi ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mahorat kategoriyasi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.skillCategoryService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha mahorat kategoriyasi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan mahorat kategoriyasining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateSkillCategoryDto,
    description: "Yangilanadigan mahorat kategoriyasi ma'lumotlari",
  }) // UpdateSkillCategoryDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Mahorat kategoriyasi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mahorat kategoriyasi topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateSkillCategoryDto: UpdateSkillCategoryDto
  ) {
    return this.skillCategoryService.update(id, updateSkillCategoryDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha mahorat kategoriyasini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan mahorat kategoriyasining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Mahorat kategoriyasi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Mahorat kategoriyasi topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.skillCategoryService.remove(id); // +id o'rniga id
  }
}
