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
import { PlayerStatService } from "./player-stat.service";
import { CreatePlayerStatDto, UpdatePlayerStatDto } from "./dto";
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

@ApiTags("Player-Stat") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("player-stat")
export class PlayerStatController {
  constructor(private readonly playerStatService: PlayerStatService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi o'yinchi statistikasi (player-stat) yaratish",
  })
  @ApiBody({
    description: "O'yinchi statistikasi yaratish uchun ma'lumotlar",
    type: CreatePlayerStatDto, // CreatePlayerStatDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "O'yinchi statistikasi muvaffaqiyatli yaratildi.",
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
  create(@Body() createPlayerStatDto: CreatePlayerStatDto) {
    return this.playerStatService.create(createPlayerStatDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha o'yinchi statistikalar ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Barcha o'yinchi statistikalar ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.playerStatService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha o'yinchi statistikasi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "O'yinchi statistikasining unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi statistikasi ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yinchi statistikasi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.playerStatService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha o'yinchi statistikasi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan o'yinchi statistikasining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdatePlayerStatDto,
    description: "Yangilanadigan o'yinchi statistikasi ma'lumotlari",
  }) // UpdatePlayerStatDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "O'yinchi statistikasi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yinchi statistikasi topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updatePlayerStatDto: UpdatePlayerStatDto
  ) {
    return this.playerStatService.update(id, updatePlayerStatDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yinchi statistikasini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan o'yinchi statistikasining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi statistikasi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yinchi statistikasi topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.playerStatService.remove(id); // +id o'rniga id
  }
}
