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
import { CoachTeamService } from "./coach-team.service";
import { CreateCoachTeamDto, UpdateCoachTeamDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { JwtSelfGuard, RolesGuard } from "../common/guards"; // JwtSelfGuard ishlatilmayapti, lekin import qilingan
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth, // Autentifikatsiya uchun
} from "@nestjs/swagger";

@ApiTags("Coach-Team") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("coach-team")
export class CoachTeamController {
  constructor(private readonly coachTeamService: CoachTeamService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi murabbiy-jamoa birikmasini yaratish" })
  @ApiBody({
    description: "Murabbiy-jamoa birikmasini yaratish uchun ma'lumotlar",
    type: CreateCoachTeamDto, // CreateCoachTeamDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Murabbiy-jamoa birikmasi muvaffaqiyatli yaratildi.",
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
  create(@Body() createCoachTeamDto: CreateCoachTeamDto) {
    return this.coachTeamService.create(createCoachTeamDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Barcha murabbiy-jamoa birikmalari ro'yxatini olish",
  })
  @ApiResponse({
    status: 200,
    description: "Barcha murabbiy-jamoa birikmalari ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.coachTeamService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha murabbiy-jamoa birikmasi ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "Murabbiy-jamoa birikmasining unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Murabbiy-jamoa birikmasi ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "Murabbiy-jamoa birikmasi topilmadi.",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.coachTeamService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha murabbiy-jamoa birikmasi ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan murabbiy-jamoa birikmasining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateCoachTeamDto,
    description: "Yangilanadigan murabbiy-jamoa birikmasi ma'lumotlari",
  }) // UpdateCoachTeamDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Murabbiy-jamoa birikmasi muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "Murabbiy-jamoa birikmasi topilmadi.",
  })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateCoachTeamDto: UpdateCoachTeamDto
  ) {
    return this.coachTeamService.update(id, updateCoachTeamDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha murabbiy-jamoa birikmasini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan murabbiy-jamoa birikmasining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Murabbiy-jamoa birikmasi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "Murabbiy-jamoa birikmasi topilmadi.",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.coachTeamService.remove(id); // +id o'rniga id
  }
}
