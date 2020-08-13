import { ResourceNameEnum } from '../../../enums/resource-name.enum';

export class PolicyDto {
  resourceOwnerName: ResourceNameEnum;
  resourceOwnerId: number;
  resourceName: ResourceNameEnum;
  resourceId: number;
  actions?: string;
}
