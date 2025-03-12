import { PartialType } from "@nestjs/swagger";
import { CreateCoachDto } from "../../user/dto";

export class UpdateCoachDto extends PartialType(CreateCoachDto) {}
