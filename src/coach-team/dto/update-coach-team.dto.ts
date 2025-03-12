import { PartialType } from '@nestjs/swagger';
import { CreateCoachTeamDto } from './create-coach-team.dto';

export class UpdateCoachTeamDto extends PartialType(CreateCoachTeamDto) {}
