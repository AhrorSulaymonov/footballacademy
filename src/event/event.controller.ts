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
import { EventService } from "./event.service";
import { CreateEventDto, UpdateEventDto } from "./dto";
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

@ApiTags("Event") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi tadbir (event) yaratish" })
  @ApiBody({
    description: "Tadbir yaratish uchun ma'lumotlar",
    type: CreateEventDto, // CreateEventDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({ status: 201, description: "Tadbir muvaffaqiyatli yaratildi." })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (rol to'g'ri kelmadi).",
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha tadbirlar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha tadbirlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.eventService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha tadbir ma'lumotlarini olish" })
  @ApiParam({
    name: "id",
    description: "Tadbirning unikal ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Tadbir ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Tadbir topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.eventService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha tadbir ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan tadbirning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateEventDto,
    description: "Yangilanadigan tadbir ma'lumotlari",
  }) // UpdateEventDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Tadbir muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Tadbir topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateEventDto: UpdateEventDto
  ) {
    return this.eventService.update(id, updateEventDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha tadbirni o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan tadbirning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Tadbir muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Tadbir topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.eventService.remove(id); // +id o'rniga id
  }
}
