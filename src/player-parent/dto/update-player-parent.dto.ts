import { PartialType } from '@nestjs/swagger';
import { CreatePlayerParentDto } from './create-player-parent.dto';

export class UpdatePlayerParentDto extends PartialType(CreatePlayerParentDto) {}
