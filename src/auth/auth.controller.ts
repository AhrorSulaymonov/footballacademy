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

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(JwtCreatorGuard)
  // @UseGuards(AccessTokenAdminGuard)
  @Post("signup-admin")
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
        fileSize: 2 * 1024 * 1024, // Maksimal fayl hajmi: 2MB
      },
    })
  )
  async signUpAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.authService.signUpAdmin(createAdminDto, image);
  }

  @Public()
  @Post("signup")
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
        fileSize: 2 * 1024 * 1024, // Maksimal fayl hajmi: 2MB
      },
    })
  )
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.authService.signUp(createUserDto, image);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin-admin")
  async signInAdmin(
    @Body() signInDto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signInAdmin(signInDto, res);
  }

  @UseGuards(JwtSelfGuard)
  @UseGuards(RefreshTokenAdminGuard)
  @HttpCode(200)
  @Post("signout-admin")
  signoutAdmin(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOutAdmin(refreshToken, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signIn(
    @Body() signInDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @UseGuards(JwtSelfGuard)
  @UseGuards(RefreshTokenAdminGuard)
  @HttpCode(200)
  @Post("refresh-admin")
  refreshAdmin(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.refreshTokenAdmin(userId, refreshToken, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("signout")
  @HttpCode(HttpStatus.OK)
  signout(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(+userId, res);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post("refresh")
  refresh(
    @GetCurrentUserId() userId: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @GetCurrentUser() user: JwtPayloadWithRefreshToken,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.refreshToken(+userId, refreshToken, res);
  }
}
