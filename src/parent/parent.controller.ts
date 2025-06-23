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
import { ParentService } from "./parent.service";
import { UpdateParentDto } from "./dto";
import { CreateParentDto } from "../user/dto"; // Bu DTO user papkasida ekanligiga e'tibor bering
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

@ApiTags("Parent") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("parent")
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi ota-ona (parent) yaratish" })
  @ApiBody({
    description: "Ota-ona yaratish uchun ma'lumotlar",
    type: CreateParentDto, // CreateParentDto da @ApiProperty bo'lishi kerak
  })
  @ApiResponse({
    status: 201,
    description: "Ota-ona muvaffaqiyatli yaratildi.",
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
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentService.create(createParentDto);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha ota-onalar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha ota-onalar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.parentService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha ota-ona ma'lumotlarini olish" })
  @ApiParam({
    name: "id",
    description: "Ota-onaning unikal ID si (odatda user ID)",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Ota-ona ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Ota-ona topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.parentService.findOne(id); // +id o'rniga id
  }

  @Patch(":id")
  @HttpCode(200)
  @UseGuards(JwtSelfGuard) // Bu Guard access token (Bearer) ni tekshiradi va o'z profilini o'zgartirishga ruxsat beradi
  @Roles("ADMIN", "PARENT") // Qo'shimcha rol tekshiruvi
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha ota-ona ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan ota-onaning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateParentDto,
    description: "Yangilanadigan ota-ona ma'lumotlari",
  }) // UpdateParentDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Ota-ona muvaffaqiyatli yangilandi.",
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
  @ApiResponse({ status: 404, description: "Ota-ona topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateParentDto: UpdateParentDto
  ) {
    return this.parentService.update(id, updateParentDto); // +id o'rniga id
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha ota-onani o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan ota-onaning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Ota-ona muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Ota-ona topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    return this.parentService.remove(id); // +id o'rniga id
  }
}
