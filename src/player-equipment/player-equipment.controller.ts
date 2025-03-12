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
import { PlayerEquipmentService } from "./player-equipment.service";
import { CreatePlayerEquipmentDto, UpdatePlayerEquipmentDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";

@Controller("player-equipment")
export class PlayerEquipmentController {
  constructor(
    private readonly playerEquipmentService: PlayerEquipmentService
  ) {}
  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createPlayerEquipmentDto: CreatePlayerEquipmentDto) {
    return this.playerEquipmentService.create(createPlayerEquipmentDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.playerEquipmentService.findAll();
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.playerEquipmentService.findOne(+id);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePlayerEquipmentDto: UpdatePlayerEquipmentDto
  ) {
    return this.playerEquipmentService.update(+id, updatePlayerEquipmentDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.playerEquipmentService.remove(+id);
  }
}
