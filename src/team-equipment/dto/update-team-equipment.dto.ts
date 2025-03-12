import { PartialType } from '@nestjs/swagger';
import { CreateTeamEquipmentDto } from './create-team-equipment.dto';

export class UpdateTeamEquipmentDto extends PartialType(CreateTeamEquipmentDto) {}
