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
  HttpStatus,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { SignupAdminDto, SignInAdminDto, CreateAdminDto } from "../admin/dto";
import { Response } from "express";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { JwtPayloadWithRefreshToken, ResponseFields } from "../common/types";
import { Public } from "../common/decorators";
import {
  AccessTokenAdminGuard,
  JwtCreatorGuard,
  JwtSelfGuard,
  RefreshTokenAdminGuard,
  RefreshTokenGuard,
} from "../common/guards";
import { CreateUserDto, SignInUserDto } from "../user/dto";
import { GetCurrentUser } from "../common/decorators/get-current-user.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  // ApiCookieAuth,
} from "@nestjs/swagger";
// TokenResponseDto importi olib tashlandi

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(JwtCreatorGuard)
  // @UseGuards(AccessTokenAdminGuard)
  @Post("signup-admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi adminni ro'yxatdan o'tkazish" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Admin yaratish uchun ma'lumotlar va rasm",
    type: CreateAdminDto,
  })
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
            new BadRequestException("Faqat image filelar yuklash mumkin!"),
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
    description:
      "Admin muvaffaqiyatli ro'yxatdan o'tkazildi." /* Agar javobda admin ma'lumotlari qaytsa, schema bilan tavsiflang */,
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi yoki fayl formati).",
  })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q (agar guardlar aktiv bo'lsa).",
  })
  async signUpAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.authService.signUpAdmin(createAdminDto, image);
  }

  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Foydalanuvchi yaratish uchun ma'lumotlar va rasm",
    type: CreateUserDto,
  })
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
            new BadRequestException("Faqat image filelar yuklash mumkin!"),
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
    description:
      "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi." /* Agar javobda foydalanuvchi ma'lumotlari qaytsa, schema bilan tavsiflang */,
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi yoki fayl formati).",
  })
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.authService.signUp(createUserDto, image);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("signin-admin")
  @ApiOperation({ summary: "Admin tizimga kirishi" })
  @ApiBody({ type: SignInAdminDto })
  @ApiResponse({
    status: 200,
    description:
      "Admin muvaffaqiyatli tizimga kirdi. Cookie'da refresh_token o'rnatiladi.",
    schema: {
      // <--- O'ZGARTIRILDI: type o'rniga schema
      type: "object",
      properties: {
        access_token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
        // Agar ResponseFields da boshqa maydonlar bo'lsa, ularni ham shu yerga qo'shing
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Login yoki parol noto'g'ri." })
  async signInAdmin(
    @Body() signInDto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signInAdmin(signInDto, res);
  }

  @Post("signout-admin")
  @HttpCode(200)
  @UseGuards(JwtSelfGuard)
  @UseGuards(RefreshTokenAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Admin tizimdan chiqishi",
    description:
      "Access token headerda (Bearer <token>), refresh_token esa cookie'da yuborilishi kerak. Cookie tozalab yuboriladi.",
  })
  @ApiResponse({
    status: 200,
    description: "Admin muvaffaqiyatli tizimdan chiqdi. Cookie tozalangan.",
  })
  @ApiResponse({
    status: 401,
    description: "Avtorizatsiyadan o'tilmagan (tokenlar noto'g'ri yoki yo'q).",
  })
  signoutAdmin(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOutAdmin(refreshToken, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  @ApiOperation({ summary: "Foydalanuvchi tizimga kirishi" })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({
    status: 200,
    description:
      "Foydalanuvchi muvaffaqiyatli tizimga kirdi. Cookie'da refresh_token o'rnatiladi.",
    schema: {
      // <--- O'ZGARTIRILDI: type o'rniga schema
      type: "object",
      properties: {
        access_token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri so'rov (validatsiya xatosi).",
  })
  @ApiResponse({ status: 401, description: "Login yoki parol noto'g'ri." })
  async signIn(
    @Body() signInDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @Post("refresh-admin")
  @HttpCode(200)
  @UseGuards(JwtSelfGuard)
  @UseGuards(RefreshTokenAdminGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Admin uchun tokenlarni yangilash",
    description:
      "Access token headerda (Bearer <token>), refresh_token esa cookie'da yuborilishi kerak. Yangi tokenlar va cookie o'rnatiladi.",
  })
  @ApiResponse({
    status: 200,
    description: "Tokenlar muvaffaqiyatli yangilandi. Yangi cookie o'rnatildi.",
    schema: {
      // <--- O'ZGARTIRILDI: type o'rniga schema
      type: "object",
      properties: {
        access_token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Avtorizatsiyadan o'tilmagan (tokenlar noto'g'ri yoki yo'q).",
  })
  refreshAdmin(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.refreshTokenAdmin(userId, refreshToken, res);
  }

  @Post("signout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: "Foydalanuvchi tizimdan chiqishi",
    description:
      "Refresh_token cookie'da yuborilishi kerak. Cookie tozalab yuboriladi.",
  })
  @ApiResponse({
    status: 200,
    description:
      "Foydalanuvchi muvaffaqiyatli tizimdan chiqdi. Cookie tozalangan.",
  })
  @ApiResponse({
    status: 401,
    description:
      "Avtorizatsiyadan o'tilmagan (refresh_token noto'g'ri yoki yo'q).",
  })
  signout(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(+userId, res);
  }

  @Post("refresh")
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: "Foydalanuvchi uchun tokenlarni yangilash",
    description:
      "Refresh_token cookie'da yuborilishi kerak. Yangi tokenlar va cookie o'rnatiladi.",
  })
  @ApiResponse({
    status: 200,
    description: "Tokenlar muvaffaqiyatli yangilandi. Yangi cookie o'rnatildi.",
    schema: {
      // <--- O'ZGARTIRILDI: type o'rniga schema
      type: "object",
      properties: {
        access_token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      "Avtorizatsiyadan o'tilmagan (refresh_token noto'g'ri yoki yo'q).",
  })
  refresh(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @GetCurrentUser() user: JwtPayloadWithRefreshToken,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.refreshToken(+userId, refreshToken, res);
  }
}
