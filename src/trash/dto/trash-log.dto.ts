import { ValidateNested } from 'class-validator';
import { TrashInfo } from './trash-info.dto';

export class TrashLog {
  @ValidateNested()
  can: TrashInfo;

  @ValidateNested()
  pet: TrashInfo;

  @ValidateNested()
  plastic: TrashInfo;
}
