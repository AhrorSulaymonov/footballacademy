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
  Query,
  ParseIntPipe, // Faqat ID uchun
} from "@nestjs/common";
import { PlayerService } from "./player.service";
import { CreatePlayerDto } from "../user/dto";
import { UpdatePlayerDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { JwtSelfGuard, RolesGuard } from "../common/guards";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("Player")
@ApiBearerAuth("access-token")
@Controller("player")
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @HttpCode(201)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi o'yinchi (player) yaratish" })
  @ApiBody({
    description: "O'yinchi yaratish uchun ma'lumotlar",
    type: CreatePlayerDto,
  })
  @ApiResponse({
    status: 201,
    description: "O'yinchi muvaffaqiyatli yaratildi.",
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
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha o'yinchilar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha o'yinchilar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.playerService.findAll();
  }

  @Get("top-goals")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Eng ko'p gol urgan o'yinchilar ro'yxatini olish" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Qaytariladigan o'yinchilar soni",
    type: String,
  }) // type: String ga o'zgartirildi
  @ApiResponse({
    status: 200,
    description: "Eng ko'p gol urgan o'yinchilar ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findTopGoalScorers(@Query("limit") limit?: string) {
    // ParseIntPipe olib tashlandi, limit string | undefined bo'lib qoldi
    return this.playerService.findTopGoalScorers(limit);
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yinchi ma'lumotlarini olish" })
  @ApiParam({
    name: "id",
    description: "O'yinchining unikal ID si (odatda user ID)",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "O'yinchi ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yinchi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.playerService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  @UseGuards(JwtSelfGuard)
  @Roles("ADMIN", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yinchi ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan o'yinchining ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdatePlayerDto,
    description: "Yangilanadigan o'yinchi ma'lumotlari",
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi muvaffaqiyatli yangilandi.",
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
  @ApiResponse({ status: 404, description: "O'yinchi topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto
  ) {
    return this.playerService.update(id, updatePlayerDto);
  }

  @Delete(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha o'yinchini o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan o'yinchining ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "O'yinchi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "O'yinchi topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.playerService.remove(id);
  }
}
