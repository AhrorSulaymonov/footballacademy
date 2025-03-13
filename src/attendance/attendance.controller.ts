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
import { AttendanceService } from "./attendance.service";
import { CreateAttendanceDto, UpdateAttendanceDto } from "./dto";
import { Roles } from "../common/decorators/roles-auth.decorator";
import { RolesGuard } from "../common/guards";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Get("player-attendance")
  getPlayerAttendance() {
    return this.attendanceService.getPlayerAttendance();
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.attendanceService.findOne(+id);
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto
  ) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @HttpCode(200)
  @Roles("COACH", "ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.attendanceService.remove(+id);
  }
}
