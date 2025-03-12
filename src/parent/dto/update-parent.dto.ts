import { PartialType } from "@nestjs/swagger";
import { CreateParentDto } from "../../user/dto";

export class UpdateParentDto extends PartialType(CreateParentDto) {}
