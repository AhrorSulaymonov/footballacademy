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
import { EquipmentService } from "./equipment.service";
import { CreateEquipmentDto, UpdateEquipmentDto } from "./dto";
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

@ApiTags("Equipment") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("equipment")
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi jihoz (equipment) yaratish" })
  @ApiBody({
    description: "Jihoz yaratish uchun ma'lumotlar",
    type: CreateEquipmentDto, // CreateEquipmentDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({ status: 201, description: "Jihoz muvaffaqiyatli yaratildi." })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (rol to'g'ri kelmadi).",
  })
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha jihozlar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha jihozlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha jihoz ma'lumotlarini olish" })
  @ApiParam({ name: "id", description: "Jihozning unikal ID si", type: Number })
  @ApiResponse({ status: 200, description: "Jihoz ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Jihoz topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.equipmentService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha jihoz ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan jihozning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateEquipmentDto,
    description: "Yangilanadigan jihoz ma'lumotlari",
  }) // UpdateEquipmentDto da @ApiProperty bo'lishi kerak
  @ApiResponse({ status: 200, description: "Jihoz muvaffaqiyatli yangilandi." })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Jihoz topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateEquipmentDto: UpdateEquipmentDto
  ) {
    return this.equipmentService.update(id, updateEquipmentDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha jihozni o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan jihozning ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Jihoz muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Jihoz topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.equipmentService.remove(id); // +id o'rniga id
  }
}
