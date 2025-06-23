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
  HttpCode,
  UseGuards,
  ParseIntPipe, // ID ni parse qilish uchun
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"; // ApiBearerAuth va ApiResponse qo'shildi
import { Roles } from "../common/decorators/roles-auth.decorator";
import { JwtSelfGuard, RolesGuard } from "../common/guards";
import { UpdateUserPasswordDto } from "./dto";

@ApiTags("User")
@ApiBearerAuth("access-token") // <--- BUTUN CONTROLLER UCHUN BEARER AUTHENTIKATSIYASINI BELGILAYDI
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201) // Yaratilganda odatda 201 status kodi qaytariladi
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @ApiConsumes("multipart/form-data")
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
        fileSize: 2 * 1024 * 1024,
      },
    })
  )
  @ApiResponse({
    status: 201,
    description: "Foydalanuvchi muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({
    status: 400,
    description:
      "Noto'g'ri so'rov (masalan, validatsiya xatosi yoki fayl formati noto'g'ri).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (rol to'g'ri kelmadi).",
  })
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    // CreateUserDto ichidagi maydonlar uchun @ApiProperty qo'shilgan deb taxmin qilinadi
    return this.userService.create(createUserDto, image);
  }

  @Patch(":id/image")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard, JwtSelfGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
          description: "Foydalanuvchi uchun yangi rasm",
        },
      },
      required: ["image"],
    },
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
        fileSize: 2 * 1024 * 1024, // Maksimal 2MB
      },
    })
  )
  @ApiResponse({ status: 200, description: "Rasm muvaffaqiyatli yuklandi." })
  @ApiResponse({
    status: 400,
    description:
      "Noto'g'ri so'rov (ID formati, fayl yo'q yoki fayl formati noto'g'ri).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi." })
  uploadImage(
    @Param("id", ParseIntPipe) id: number, // ParseIntPipe ID ni avtomatik songa o'giradi va validatsiya qiladi
    @UploadedFile() image?: Express.Multer.File
  ) {
    if (!image) {
      throw new BadRequestException("Fayl yuklanmadi!");
    }
    return this.userService.uploadImage(id, image);
  }

  @Get()
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: "Barcha foydalanuvchilar ro'yxati.",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @ApiResponse({ status: 200, description: "Foydalanuvchi ma'lumotlari." })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard, JwtSelfGuard) // JwtSelfGuard va RolesGuard birgalikda
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    // UpdateUserDto ichidagi maydonlar uchun @ApiProperty qo'shilgan deb taxmin qilinadi
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(200) // Yoki 204 (No Content) agar javob qaytarilmasa
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ID formati." })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi." })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Get("activate/:link")
  @HttpCode(200)
  @ApiBearerAuth() // Agar bu endpoint ham token talab qilsa. Agar public bo'lsa, buni olib tashlang yoki @ApiExcludeAuth() dan foydalaning.
  // Hozircha class darajasidagi @ApiBearerAuth ta'sir qiladi. Agar bu endpoint uchun kerak bo'lmasa, alohida ko'rsatish kerak.
  // Agar bu endpoint public bo'lsa va Guard ishlatilmasa, @ApiBearerAuth ni bu yerda qo'yish shart emas.
  // Lekin class darajasida qo'yilgani uchun Swagger UI da baribir "qulfcha" belgisi ko'rinadi.
  // Agar bu endpoint uchun autentifikatsiya umuman kerak bo'lmasa va Swaggerda ham ko'rinmasligi kerak bo'lsa,
  // @nestjs/swagger dan @ApiExcludeEndpoint(true) yoki @ApiSecurity({}) kabi dekoratorlardan foydalanish mumkin.
  // Hozircha, Guard yo'qligi sababli, token yuborilsa ham tekshirilmaydi.
  @ApiResponse({
    status: 200,
    description: "Hisob muvaffaqiyatli aktivlashtirildi.",
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri aktivatsiya havolasi." }) // Yoki 404
  activate(@Param("link") link: string) {
    return this.userService.activate(link);
  }

  @Patch(":id/password")
  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard, JwtSelfGuard)
  @ApiResponse({ status: 200, description: "Parol muvaffaqiyatli yangilandi." })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (ID formati yoki validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Avtorizatsiyadan o'tilmagan." })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q." })
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi." })
  async updatePassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdateUserPasswordDto
  ) {
    // UpdateUserPasswordDto ichidagi maydonlar uchun @ApiProperty qo'shilgan deb taxmin qilinadi
    return this.userService.updatePassword(id, updatePasswordDto);
  }
}
