import { PartialType } from '@nestjs/swagger';
import { CreateSkillEvaluationDto } from './create-skill-evaluation.dto';

export class UpdateSkillEvaluationDto extends PartialType(CreateSkillEvaluationDto) {}
