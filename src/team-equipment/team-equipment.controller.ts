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
import { TeamEquipmentService } from "./team-equipment.service";
import { CreateTeamEquipmentDto, UpdateTeamEquipmentDto } from "./dto";
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

@ApiTags("Team-Equipment") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("team-equipment")
export class TeamEquipmentController {
  constructor(private readonly teamEquipmentService: TeamEquipmentService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi jamoa-jihoz birikmasini (team-equipment) yaratish",
  })
  @ApiBody({
    description: "Jamoa-jihoz birikmasini yaratish uchun ma'lumotlar",
    type: CreateTeamEquipmentDto, // CreateTeamEquipmentDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Jamoa-jihoz birikmasi muvaffaqiyatli yaratildi.",
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
  create(@Body() createTeamEquipmentDto: CreateTeamEquipmentDto) {
    return this.teamEquipmentService.create(createTeamEquipmentDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha jamoa-jihoz birikmalari ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Barcha jamoa-jihoz birikmalari ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.teamEquipmentService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha jamoa-jihoz birikmasi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "Jamoa-jihoz birikmasining unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Jamoa-jihoz birikmasi ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Jamoa-jihoz birikmasi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.teamEquipmentService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha jamoa-jihoz birikmasi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan jamoa-jihoz birikmasining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateTeamEquipmentDto,
    description: "Yangilanadigan jamoa-jihoz birikmasi ma'lumotlari",
  }) // UpdateTeamEquipmentDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Jamoa-jihoz birikmasi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Jamoa-jihoz birikmasi topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateTeamEquipmentDto: UpdateTeamEquipmentDto
  ) {
    return this.teamEquipmentService.update(id, updateTeamEquipmentDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha jamoa-jihoz birikmasini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan jamoa-jihoz birikmasining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Jamoa-jihoz birikmasi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Jamoa-jihoz birikmasi topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.teamEquipmentService.remove(id); // +id o'rniga id
  }
}
