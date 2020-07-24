import { ResourceNameEnum } from '../../../enums/resource-name.enum';

export class CreatePolicyDto {
  resourceOwnerName: ResourceNameEnum;
  resourceOwnerId: number;
  resourceName: ResourceNameEnum;
  resourceId: number;
}
