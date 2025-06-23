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
import { PlayerEquipmentService } from "./player-equipment.service";
import { CreatePlayerEquipmentDto, UpdatePlayerEquipmentDto } from "./dto";
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

@ApiTags("Player-Equipment") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("player-equipment")
export class PlayerEquipmentController {
  constructor(
    private readonly playerEquipmentService: PlayerEquipmentService
  ) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi o'yinchi-jihoz birikmasini (player-equipment) yaratish",
  })
  @ApiBody({
    description: "O'yinchi-jihoz birikmasini yaratish uchun ma'lumotlar",
    type: CreatePlayerEquipmentDto, // CreatePlayerEquipmentDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "O'yinchi-jihoz birikmasi muvaffaqiyatli yaratildi.",
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
  create(@Body() createPlayerEquipmentDto: CreatePlayerEquipmentDto) {
    return this.playerEquipmentService.create(createPlayerEquipmentDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Barcha o'yinchi-jihoz birikmalari ro'yxatini olish",
  })
  @ApiResponse({
    status: 200,
    description: "Barcha o'yinchi-jihoz birikmalari ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.playerEquipmentService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha o'yinchi-jihoz birikmasi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "O'yinchi-jihoz birikmasining unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi-jihoz birikmasi ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "O'yinchi-jihoz birikmasi topilmadi.",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.playerEquipmentService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha o'yinchi-jihoz birikmasi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan o'yinchi-jihoz birikmasining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdatePlayerEquipmentDto,
    description: "Yangilanadigan o'yinchi-jihoz birikmasi ma'lumotlari",
  }) // UpdatePlayerEquipmentDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "O'yinchi-jihoz birikmasi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "O'yinchi-jihoz birikmasi topilmadi.",
  })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updatePlayerEquipmentDto: UpdatePlayerEquipmentDto
  ) {
    return this.playerEquipmentService.update(id, updatePlayerEquipmentDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yinchi-jihoz birikmasini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan o'yinchi-jihoz birikmasining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi-jihoz birikmasi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "O'yinchi-jihoz birikmasi topilmadi.",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.playerEquipmentService.remove(id); // +id o'rniga id
  }
}
