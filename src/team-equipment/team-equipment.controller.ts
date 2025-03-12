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
import { TeamEquipmentService } from "./team-equipment.service";
import { CreateTeamEquipmentDto, UpdateTeamEquipmentDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";

@Controller("team-equipment")
export class TeamEquipmentController {
  constructor(private readonly teamEquipmentService: TeamEquipmentService) {}

  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createTeamEquipmentDto: CreateTeamEquipmentDto) {
    return this.teamEquipmentService.create(createTeamEquipmentDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.teamEquipmentService.findAll();
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.teamEquipmentService.findOne(+id);
  }

  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTeamEquipmentDto: UpdateTeamEquipmentDto
  ) {
    return this.teamEquipmentService.update(+id, updateTeamEquipmentDto);
  }

  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.teamEquipmentService.remove(+id);
  }
}
