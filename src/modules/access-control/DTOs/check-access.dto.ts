import { ResourceNameEnum } from '../../../enums/resource-name.enum';

export class CheckAccessDto {
  public sub: ResourceNameEnum;
  public obj: ResourceNameEnum;
  public action = 'GET';
}
