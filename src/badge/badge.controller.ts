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
} from "@nestjs/common";
import { BadgeService } from "./badge.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateBadgeDto, UpdateBadgeDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";

@ApiTags("Badge") // Swagger da kategoriya qo‘shish
@Controller("badge")
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  @ApiConsumes("multipart/form-data") // Swagger da file yuklashni to‘g‘ri ko‘rsatish
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
  create(
    @Body() createBadgeDto: CreateBadgeDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.badgeService.create(createBadgeDto, image);
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.badgeService.findAll();
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    const badgeId = parseInt(id, 10);
    if (isNaN(badgeId)) {
      throw new BadRequestException("ID noto‘g‘ri formatda!");
    }
    return this.badgeService.findOne(badgeId);
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBadgeDto: UpdateBadgeDto) {
    const badgeId = parseInt(id, 10);
    if (isNaN(badgeId)) {
      throw new BadRequestException("ID noto‘g‘ri formatda!");
    }
    return this.badgeService.update(badgeId, updateBadgeDto);
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    const badgeId = parseInt(id, 10);
    if (isNaN(badgeId)) {
      throw new BadRequestException("ID noto‘g‘ri formatda!");
    }
    return this.badgeService.remove(badgeId);
  }
}
