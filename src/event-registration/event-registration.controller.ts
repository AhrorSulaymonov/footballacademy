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
import { EventRegistrationService } from "./event-registration.service";
import { CreateEventRegistrationDto, UpdateEventRegistrationDto } from "./dto";
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

@ApiTags("Event-Registration") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("event-registration")
export class EventRegistrationController {
  constructor(
    private readonly eventRegistrationService: EventRegistrationService
  ) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Yangi tadbirga ro'yxatdan o'tish (event registration) yaratish",
  })
  @ApiBody({
    description: "Tadbirga ro'yxatdan o'tish uchun ma'lumotlar",
    type: CreateEventRegistrationDto, // CreateEventRegistrationDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Tadbirga ro'yxatdan o'tish muvaffaqiyatli yaratildi.",
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
  create(@Body() createEventRegistrationDto: CreateEventRegistrationDto) {
    return this.eventRegistrationService.create(createEventRegistrationDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "Barcha tadbirga ro'yxatdan o'tishlar ro'yxatini olish",
  })
  @ApiResponse({
    status: 200,
    description: "Barcha tadbirga ro'yxatdan o'tishlar ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.eventRegistrationService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha tadbirga ro'yxatdan o'tish ma'lumotlarini olish",
  })
  @ApiParam({
    name: "id",
    description: "Tadbirga ro'yxatdan o'tishning unikal ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Tadbirga ro'yxatdan o'tish ma'lumotlari.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "Tadbirga ro'yxatdan o'tish topilmadi.",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.eventRegistrationService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha tadbirga ro'yxatdan o'tish ma'lumotlarini yangilash",
  })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan tadbirga ro'yxatdan o'tishning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateEventRegistrationDto,
    description: "Yangilanadigan tadbirga ro'yxatdan o'tish ma'lumotlari",
  }) // UpdateEventRegistrationDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Tadbirga ro'yxatdan o'tish muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "Tadbirga ro'yxatdan o'tish topilmadi.",
  })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateEventRegistrationDto: UpdateEventRegistrationDto
  ) {
    return this.eventRegistrationService.update(
      id, // +id o'rniga id
      updateEventRegistrationDto
    );
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: "ID bo'yicha tadbirga ro'yxatdan o'tishni o'chirish",
  })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan tadbirga ro'yxatdan o'tishning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Tadbirga ro'yxatdan o'tish muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({
    status: 404,
    description: "Tadbirga ro'yxatdan o'tish topilmadi.",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.eventRegistrationService.remove(id); // +id o'rniga id
  }
}
