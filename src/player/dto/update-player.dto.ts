import { PartialType } from "@nestjs/swagger";
import { CreatePlayerDto } from "../../user/dto";

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}
