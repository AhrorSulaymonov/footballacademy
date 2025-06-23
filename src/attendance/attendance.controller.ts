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
  ParseIntPipe, // ID ni parse qilish uchun
} from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { CreateAttendanceDto, UpdateAttendanceDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger"; // Swagger uchun kerakli importlar

@ApiTags("Attendance") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(201) // Yaratilganda odatda 201 status kodi
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard) // Bu Guard autentifikatsiya va avtorizatsiyani tekshiradi
  @ApiBody({
    type: CreateAttendanceDto,
    description: "Yangi davomat ma'lumotlari",
  })
  @ApiResponse({
    status: 201,
    description: "Davomat muvaffaqiyatli qo'shildi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (masalan, validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (rol to'g'ri kelmadi).",
  })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    // CreateAttendanceDto da @ApiProperty bo'lishi kerak
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 200, description: "Barcha davomatlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get("player-attendance")
  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: "O'yinchilarning davomat ma'lumotlari.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  getPlayerAttendance() {
    return this.attendanceService.getPlayerAttendance();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiParam({
    name: "id",
    description: "Davomatning unikal ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Davomat ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Davomat topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan davomatning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateAttendanceDto,
    description: "Yangilanadigan davomat ma'lumotlari",
  })
  @ApiResponse({
    status: 200,
    description: "Davomat muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Davomat topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto
  ) {
    // UpdateAttendanceDto da @ApiProperty bo'lishi kerak
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan davomatning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Davomat muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Davomat topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
