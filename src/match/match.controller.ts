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
import { MatchService } from "./match.service";
import { CreateMatchDto, UpdateMatchDto } from "./dto";
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

@ApiTags("Match") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("match")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi o'yin (match) yaratish" })
  @ApiBody({
    description: "O'yin yaratish uchun ma'lumotlar",
    type: CreateMatchDto, // CreateMatchDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({ status: 201, description: "O'yin muvaffaqiyatli yaratildi." })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (rol to'g'ri kelmadi).",
  })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha o'yinlar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha o'yinlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.matchService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yin ma'lumotlarini olish" })
  @ApiParam({ name: "id", description: "O'yinning unikal ID si", type: Number })
  @ApiResponse({ status: 200, description: "O'yin ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yin topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.matchService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yin ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan o'yinning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateMatchDto,
    description: "Yangilanadigan o'yin ma'lumotlari",
  }) // UpdateMatchDto da @ApiProperty bo'lishi kerak
  @ApiResponse({ status: 200, description: "O'yin muvaffaqiyatli yangilandi." })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yin topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateMatchDto: UpdateMatchDto
  ) {
    return this.matchService.update(id, updateMatchDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yinni o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan o'yinning ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "O'yin muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yin topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.matchService.remove(id); // +id o'rniga id
  }
}
