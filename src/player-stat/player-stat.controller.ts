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
} from "@nestjs/common";
import { PlayerStatService } from "./player-stat.service";
import { CreatePlayerStatDto, UpdatePlayerStatDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";

@Controller("player-stat")
export class PlayerStatController {
  constructor(private readonly playerStatService: PlayerStatService) {}

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createPlayerStatDto: CreatePlayerStatDto) {
    return this.playerStatService.create(createPlayerStatDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.playerStatService.findAll();
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.playerStatService.findOne(+id);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePlayerStatDto: UpdatePlayerStatDto
  ) {
    return this.playerStatService.update(+id, updatePlayerStatDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.playerStatService.remove(+id);
  }
}
