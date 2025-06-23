import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  UseGuards,
  ParseIntPipe, // ID ni parse qilish va validatsiya qilish uchun
} from "@nestjs/common";
import { BadgeService } from "./badge.service";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiConsumes,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth, // Autentifikatsiya uchun
} from "@nestjs/swagger";
import { CreateBadgeDto, UpdateBadgeDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";

@ApiTags("Badge") // Swagger da kategoriya qo‘shish (mavjud)
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("badge")
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  @HttpCode(201) // Yaratish uchun odatda 201 status kodi
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Yangi nishon (badge) yaratish" })
  @ApiConsumes("multipart/form-data") // Swagger da file yuklashni to‘g‘ri ko‘rsatish (mavjud)
  @ApiBody({
    description: "Nishon yaratish uchun ma'lumotlar va rasm",
    type: CreateBadgeDto, // CreateBadgeDto da @ApiProperty bo'lishi kerak
  })
  @UseInterceptors(
    FileInterceptor("image", {
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const isValidExt = allowedTypes.test(file.originalname.toLowerCase());
        const isValidMime = allowedTypes.test(file.mimetype);

        if (isValidExt && isValidMime) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              "Faqat JPG, JPEG, PNG yoki GIF yuklash mumkin!"
            ),
            false
          );
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // Maksimal fayl hajmi: 2MB
      },
    })
  )
  @ApiResponse({ status: 201, description: "Nishon muvaffaqiyatli yaratildi." })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi yoki fayl formati).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (rol to'g'ri kelmadi).",
  })
  create(
    @Body() createBadgeDto: CreateBadgeDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.badgeService.create(createBadgeDto, image);
  }

  @Get()
  @HttpCode(200)
  @Roles("COACH", "ADMIN") // Bu endpointlar uchun ham @ApiBearerAuth ta'sir qiladi
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Barcha nishonlar ro'yxatini olish" })
  @ApiResponse({ status: 200, description: "Barcha nishonlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.badgeService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha nishon ma'lumotlarini olish" })
  @ApiParam({
    name: "id",
    description: "Nishonning unikal ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Nishon ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Nishon topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    // const badgeId = parseInt(id, 10); // Endi kerak emas
    // if (isNaN(badgeId)) { // Endi kerak emas
    //   throw new BadRequestException("ID noto‘g‘ri formatda!");
    // }
    return this.badgeService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha nishon ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan nishonning ID si",
    type: Number,
  })
  @ApiBody({
    type: UpdateBadgeDto,
    description: "Yangilanadigan nishon ma'lumotlari",
  }) // UpdateBadgeDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Nishon muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Nishon topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ishlatildi
    @Body() updateBadgeDto: UpdateBadgeDto
  ) {
    // const badgeId = parseInt(id, 10); // Endi kerak emas
    // if (isNaN(badgeId)) { // Endi kerak emas
    //   throw new BadRequestException("ID noto‘g‘ri formatda!");
    // }
    return this.badgeService.update(id, updateBadgeDto);
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "ID bo'yicha nishonni o'chirish" })
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan nishonning ID si",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Nishon muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Nishon topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe ishlatildi
    // const badgeId = parseInt(id, 10); // Endi kerak emas
    // if (isNaN(badgeId)) { // Endi kerak emas
    //   throw new BadRequestException("ID noto‘g‘ri formatda!");
    // }
    return this.badgeService.remove(id);
  }
}
