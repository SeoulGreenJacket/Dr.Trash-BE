import { ValidateNested } from 'class-validator';
import { TrashInfo } from './trash-info.dto';

export class TrashSummary {
  @ValidateNested()
  can: TrashInfo;

  @ValidateNested()
  pet: TrashInfo;

  @ValidateNested()
  paper: TrashInfo;

  @ValidateNested()
  plastic: TrashInfo;
}
