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
import { PlayerParentService } from "./player-parent.service";
import { CreatePlayerParentDto, UpdatePlayerParentDto } from "./dto";
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

@ApiTags("Player-Parent") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("player-parent")
export class PlayerParentController {
  constructor(private readonly playerParentService: PlayerParentService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi o'yinchi-ota-ona birikmasini (player-parent) yaratish",
  })
  @ApiBody({
    description: "O'yinchi-ota-ona birikmasini yaratish uchun ma'lumotlar",
    type: CreatePlayerParentDto, // CreatePlayerParentDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "O'yinchi-ota-ona birikmasi muvaffaqiyatli yaratildi.",
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
  create(@Body() createPlayerParentDto: CreatePlayerParentDto) {
    return this.playerParentService.create(createPlayerParentDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Barcha o'yinchi-ota-ona birikmalari ro'yxatini olish",
  })
  @ApiResponse({
    status: 200,
    description: "Barcha o'yinchi-ota-ona birikmalari ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.playerParentService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha o'yinchi-ota-ona birikmasi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "O'yinchi-ota-ona birikmasining unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi-ota-ona birikmasi ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "O'yinchi-ota-ona birikmasi topilmadi.",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.playerParentService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha o'yinchi-ota-ona birikmasi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan o'yinchi-ota-ona birikmasining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdatePlayerParentDto,
    description: "Yangilanadigan o'yinchi-ota-ona birikmasi ma'lumotlari",
  }) // UpdatePlayerParentDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "O'yinchi-ota-ona birikmasi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "O'yinchi-ota-ona birikmasi topilmadi.",
  })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updatePlayerParentDto: UpdatePlayerParentDto
  ) {
    return this.playerParentService.update(id, updatePlayerParentDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha o'yinchi-ota-ona birikmasini o'chirish",
  })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan o'yinchi-ota-ona birikmasining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi-ota-ona birikmasi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "O'yinchi-ota-ona birikmasi topilmadi.",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.playerParentService.remove(id); // +id o'rniga id
  }
}
