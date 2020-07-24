import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { ForbiddenResourceError } from '../../../errors/forbidden-resource.error';
import { LoggerService } from '../../../logger/logger.service';
import { AccessControlService } from '../access-control.service';
import { ResourceNameEnum } from '../../../enums/resource-name.enum';
import { Reflector } from '@nestjs/core';

// TODO update resource access guard
@Injectable()
export class ResourceAccessGuard implements CanActivate {
  private readonly loggerContext = this.constructor.name;

  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly logger: LoggerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controller = this.reflector.get<string>('PATH_METADATA', context.getClass());

    this.logger.debug(
      {
        message: `METADATA`,
        metadata: context.getClass(),
        controller,
      },
      this.loggerContext,
    );
    const request = context.switchToHttp().getRequest();

    const acceptedMethods = ['GET', 'PUT', 'DELETE'];
    const { method, url, params } = request;

    if (!acceptedMethods.includes(method)) {
      return true;
    }

    if (!params.id) {
      return true;
    }

    const parsedUrl: string = url.split('/');
    const route: string = parsedUrl[parsedUrl.length - 2];

    const user: User = request.user;

    // @ts-ignore
    // const isValidResourceName = ResourceNameEnum[route.toUpperCase()];

    // if (!isValidResourceName) {
    //   throw new Error('resource name');
    // }

    const sub = `role:${ResourceNameEnum.USERS}/${user.id}`;
    const obj = `resource:${parsedUrl[1]}/${parsedUrl[2]}`;
    const action = method;

    let hasAccess: boolean;
    try {
      hasAccess = await this.accessControlService.enforce(sub, obj, action);
    } catch (error) {}

    if (!hasAccess) {
      this.logger.error(
        {
          message: `user do not have access to this source`,
          hasAccess,
          sub,
          obj,
          action,
          user,
          url,
        },
        new Error().stack,
        this.loggerContext,
      );
      throw new ForbiddenResourceError();
    }

    return true;
  }
}
