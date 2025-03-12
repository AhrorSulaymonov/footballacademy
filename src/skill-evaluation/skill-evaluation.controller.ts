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
import { SkillEvaluationService } from "./skill-evaluation.service";
import { CreateSkillEvaluationDto, UpdateSkillEvaluationDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";

@Controller("skill-evaluation")
export class SkillEvaluationController {
  constructor(
    private readonly skillEvaluationService: SkillEvaluationService
  ) {}

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createSkillEvaluationDto: CreateSkillEvaluationDto) {
    return this.skillEvaluationService.create(createSkillEvaluationDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.skillEvaluationService.findAll();
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH", "PARENT", "PLAYER")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.skillEvaluationService.findOne(+id);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSkillEvaluationDto: UpdateSkillEvaluationDto
  ) {
    return this.skillEvaluationService.update(+id, updateSkillEvaluationDto);
  }

  @HttpCode(200)
  @Roles("ADMIN", "COACH")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.skillEvaluationService.remove(+id);
  }
}
