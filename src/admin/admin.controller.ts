import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  UseGuards,
  Put,
  HttpCode,
  ParseIntPipe, // ID ni parse qilish uchun
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateAdminDto, UpdateAdminDto, UpdatePasswordDto } from "./dto";
import {
  AccessTokenAdminGuard,
  JwtCreatorGuard,
  RolesGuard,
} from "../common/guards";
import { JwtSelfAdminGuard } from "../common/guards/jwt-self-admin.guard";
import { Roles } from "../common/decorators/roles-auth.decorator";
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger"; // Swagger uchun kerakli importlar

@ApiTags("Admin") // Controller uchun Swagger tegi
@ApiBearerAuth("access-token") // Butun controller uchun Bearer token autentifikatsiyasi
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(201) // Yaratilganda 201 status kodi
  @UseGuards(JwtCreatorGuard) // Bu Guardlar autentifikatsiyani tekshiradi
  @UseGuards(AccessTokenAdminGuard)
  @ApiConsumes("multipart/form-data") // Fayl yuklash uchun
  @UseInterceptors(
    FileInterceptor("image", {
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException("Faqat image fayllar yuklash mumkin!"),
            false
          );
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // Maksimal fayl hajmi: 2MB
      },
    })
  )
  @ApiBody({
    description: "Admin yaratish uchun ma'lumotlar va rasm",
    type: CreateAdminDto, // DTO ni ko'rsatish (CreateAdminDto da @ApiProperty bo'lishi kerak)
    // Fayl maydoni uchun alohida ko'rsatish mumkin, lekin odatda DTO ichida @ApiProperty bilan hal qilinadi
    // yoki quyidagicha qo'shimcha qilish mumkin:
    // schema: {
    //   allOf: [
    //     { $ref: getSchemaPath(CreateAdminDto) }, // Agar CreateAdminDto ni alohida sxema sifatida ishlatsangiz
    //     {
    //       type: 'object',
    //       properties: {
    //         image: {
    //           type: 'string',
    //           format: 'binary',
    //           description: 'Admin rasmi (jpeg, jpg, png, gif)',
    //         },
    //       },
    //     },
    //   ],
    // },
  })
  @ApiResponse({ status: 201, description: "Admin muvaffaqiyatli yaratildi." })
  @ApiResponse({
    status: 400,
    description:
      "Noto'g'ri so'rov (masalan, validatsiya xatosi, fayl formati noto'g'ri).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (masalan, JwtCreatorGuard dan o'tmagan).",
  })
  create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.adminService.create(createAdminDto, image);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AccessTokenAdminGuard)
  @ApiResponse({ status: 200, description: "Barcha adminlar ro'yxati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @UseGuards(AccessTokenAdminGuard)
  @ApiParam({ name: "id", description: "Adminning unikal ID si", type: Number })
  @ApiResponse({ status: 200, description: "Admin ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 404, description: "Admin topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  @UseGuards(JwtSelfAdminGuard)
  @UseGuards(AccessTokenAdminGuard)
  @ApiParam({
    name: "id",
    description: "Yangilanayotgan adminning ID si",
    type: Number,
  })
  @ApiBody({ type: UpdateAdminDto }) // UpdateAdminDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Admin ma'lumotlari muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description:
      "Ruxsat yo'q (o'z profilini o'zgartirishga ruxsat yo'q yoki token noto'g'ri).",
  })
  @ApiResponse({ status: 404, description: "Admin topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @UseGuards(JwtCreatorGuard)
  @UseGuards(AccessTokenAdminGuard)
  @ApiParam({
    name: "id",
    description: "O'chirilayotgan adminning ID si",
    type: Number,
  })
  @ApiResponse({ status: 200, description: "Admin muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (masalan, JwtCreatorGuard dan o'tmagan).",
  })
  @ApiResponse({ status: 404, description: "Admin topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }

  @Put("update-password/:id")
  @HttpCode(200)
  @UseGuards(JwtSelfAdminGuard)
  @Roles("ADMIN") // Bu dekorator RolesGuard bilan birga ishlaydi
  @UseGuards(RolesGuard) // RolesGuard AccessTokenAdminGuard dan keyin kelishi kerak (agar AccessTokenAdminGuard ham kerak bo'lsa)
  // Hozirgi holatda AccessTokenAdminGuard bu endpoint uchun qo'yilmagan, faqat JwtSelfAdminGuard va RolesGuard bor.
  // Agar AccessTokenAdminGuard ham kerak bo'lsa, uni ham qo'shish kerak.
  @ApiParam({
    name: "id",
    description: "Paroli yangilanayotgan adminning ID si",
    type: Number,
  })
  @ApiBody({ type: UpdatePasswordDto }) // UpdatePasswordDto da @ApiProperty bo'lishi kerak
  @ApiResponse({
    status: 200,
    description: "Admin paroli muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description:
      "Ruxsat yo'q (rol to'g'ri kelmadi yoki o'z parolini o'zgartirishga ruxsat yo'q).",
  })
  @ApiResponse({ status: 404, description: "Admin topilmadi." })
  updatePassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.adminService.updatePassword(id, updatePasswordDto);
  }
}
