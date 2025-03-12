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
import { CoachTeamService } from "./coach-team.service";
import { CreateCoachTeamDto, UpdateCoachTeamDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { JwtSelfGuard, RolesGuard } from "../common/guards";

@Controller("coach-team")
export class CoachTeamController {
  constructor(private readonly coachTeamService: CoachTeamService) {}

  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createCoachTeamDto: CreateCoachTeamDto) {
    return this.coachTeamService.create(createCoachTeamDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.coachTeamService.findAll();
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.coachTeamService.findOne(+id);
  }

  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCoachTeamDto: UpdateCoachTeamDto
  ) {
    return this.coachTeamService.update(+id, updateCoachTeamDto);
  }

  @HttpCode(200)
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.coachTeamService.remove(+id);
  }
}
