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

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtCreatorGuard)
  @UseGuards(AccessTokenAdminGuard)
  @Post()
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
  create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() image: Express.Multer.File // <-- MUHIM!
  ) {
    return this.adminService.create(createAdminDto, image);
  }

  @UseGuards(AccessTokenAdminGuard)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(AccessTokenAdminGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminService.findOne(+id);
  }

  @UseGuards(JwtSelfAdminGuard)
  @UseGuards(AccessTokenAdminGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @UseGuards(JwtCreatorGuard)
  @UseGuards(AccessTokenAdminGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminService.remove(+id);
  }

  @UseGuards(JwtSelfAdminGuard)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Put("update-password/:id")
  updatePassword(
    @Param("id") id: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.adminService.updatePassword(+id, updatePasswordDto);
  }
}
