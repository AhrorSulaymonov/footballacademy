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
import { CoachService } from "./coach.service";
import { UpdateCoachDto } from "./dto";
import { CreateCoachDto } from "../user/dto"; // Bu DTO user papkasida ekanligiga e'tibor bering
import { Roles } from "../common/decorators/roles-auth.decorator";
import { JwtSelfGuard, RolesGuard } from "../common/guards";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth, // Autentifikatsiya uchun
} from "@nestjs/swagger";

@ApiTags("Coach") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("coach")
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi murabbiy (coach) yaratish" })
  @ApiBody({
    description: "Murabbiy yaratish uchun ma'lumotlar",
    type: CreateCoachDto, // CreateCoachDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Murabbiy muvaffaqiyatli yaratildi.",
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
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha murabbiylar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha murabbiylar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.coachService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha murabbiy ma'lumotlarini olish" })
  @ApiParam({
    name: "id",
    description: "Murabbiyning unikal ID si (odatda user ID)",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Murabbiy ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Murabbiy topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.coachService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @UseGuards(JwtSelfGuard) // Bu Guard access token (Bearer) ni tekshiradi va o'z profilini o'zgartirishga ruxsat beradi
  @Roles("COACH", "ADMIN") // Qo'shimcha rol tekshiruvi
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha murabbiy ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan murabbiyning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateCoachDto,
    description: "Yangilanadigan murabbiy ma'lumotlari",
  }) // UpdateCoachDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Murabbiy muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description:
      "Ruxsat yo'q (rol to'g'ri kelmadi yoki o'z profilini o'zgartirishga ruxsat yo'q).",
  })
  @ApiResponse({ status: 404, description: "Murabbiy topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateCoachDto: UpdateCoachDto
  ) {
    return this.coachService.update(id, updateCoachDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha murabbiyni o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan murabbiyning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Murabbiy muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Murabbiy topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.coachService.remove(id); // +id o'rniga id
  }
}
