import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { ForbiddenResourceError } from '../../../errors/forbidden-resource.error';
import { LoggerService } from '../../../logger/logger.service';
import { AccessControlService } from '../access-control.service';
import { ResourceNameEnum } from '../../../enums/resource-name.enum';
import { Reflector } from '@nestjs/core';

interface Resource {
  resourceName: ResourceNameEnum;
  idOfResource: number;
}

@Injectable()
export class ResourceAccessGuard implements CanActivate {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly logger: LoggerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { method, url } = request;

    const isArmiesRoute = url.endsWith('armies');

    if (isArmiesRoute) {
      return true;
    }

    const { resourceName, idOfResource } = this.getResourceFromRequest(request);

    const user: User = request.user;

    const sub = `role:${ResourceNameEnum.USER}/${user.id}`;
    const obj = `resource:${resourceName}/${idOfResource}`;
    const action = method;

    let hasAccess: boolean;
    try {
      hasAccess = await this.accessControlService.enforce(sub, obj, action);
    } catch (error) {}

    if (!hasAccess) {
      this.logger.error(
        {
          message: `user do not have access to this source`,
          resourceName,
          idOfResource,
          hasAccess,
          sub,
          obj,
          action,
          user,
        },
        new Error().stack,
        this.loggerContext,
      );
      throw new ForbiddenResourceError();
    }

    return true;
  }

  private getResourceFromRequest({ body, params }: any): Resource {
    const resources = Object.values(ResourceNameEnum);
    let name = Object.keys(body).find(key => key.includes('Id'));

    if (name) {
      return {
        resourceName: resources.find(value => value.includes(name.split('Id', 1)[0])),
        idOfResource: body[name],
      };
    }

    name = Object.keys(params).find(key => key.includes('Id'));

    if (name) {
      return {
        resourceName: resources.find(value => value.includes(name.split('Id', 1)[0])),
        idOfResource: params[name],
      };
    }

    return {
      resourceName: resources.find(value => value.includes(name.split('Id', 1)[0])),
      idOfResource: body[name],
    };
  }
}
