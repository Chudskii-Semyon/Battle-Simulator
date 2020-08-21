import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { ENFORCER_TOKEN } from './constants';
import { CouldNotCreateAccessRuleError } from '../../errors/could-not-create-access-rule.error';
import { LoggerService } from '../../logger/logger.service';
import { CreatePolicyDto } from './DTOs/create-policy.dto';
import { PolicyDto } from './DTOs/policy.dto';
import { ResourceNameEnum } from '../../enums/resource-name.enum';
import { ForbiddenResourceError } from '../../errors/forbidden-resource.error';

@Injectable()
export class AccessControlService extends Enforcer {
  private readonly loggerContext = this.constructor.name;

  constructor(
    @Inject(ENFORCER_TOKEN)
    private readonly enforcer: Enforcer,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  public async checkAccessOrFail(policy: PolicyDto): Promise<boolean> {
    const builtPolicy = this.buildPolicy(policy);

    this.logger.debug(
      {
        message: `policy`,
        builtPolicy,
      },
      this.loggerContext,
    );

    const hasAccess = await this.enforce(...builtPolicy);

    if (!hasAccess) {
      throw new ForbiddenResourceError();
    }

    return true;
  }

  public async removeAccessRuleOnDeletedUnit(policy: PolicyDto): Promise<boolean> {
    const { resourceOwnerId, resourceOwnerName, resourceId, resourceName } = policy;
    const [owner, resource] = this.buildPolicy(policy);
    const actions = '(GET)|(POST)|(PUT)|(DELETE)';
    const role = this.buildRole(resourceName, resourceId);
    const permissionsOfResource = await this.enforcer.getImplicitPermissionsForUser(role);
    await this.enforcer.deleteRolesForUser(role);
    // const rolesOfResource = await this.enforcer.getImplicitRolesForUser(role);

    await this.enforcer.removePolicies(permissionsOfResource);
    await this.enforcer.removePolicy(owner, resource, actions);

    const sub = this.buildRole(resourceOwnerName, resourceOwnerId);
    const obj = this.buildRole(resourceName, resourceId);

    await this.enforcer.removeGroupingPolicy(sub, obj);

    return true;
  }

  public async addAccessRuleToCreatedUnit(createPolicyDto: CreatePolicyDto): Promise<boolean> {
    const { resourceOwnerName, resourceOwnerId, resourceName, resourceId } = createPolicyDto;

    const owner = `${resourceOwnerName}/${resourceOwnerId}`;
    const resource = `${resourceName}/${resourceId}`;
    const actions = '(GET)|(POST)|(PUT)|(DELETE)';

    try {
      await this.enforcer.addPermissionForUser(`role:${owner}`, `resource:${resource}`, actions);
      await this.enforcer.addRoleForUser(`role:${owner}`, `role:${resource}`);
    } catch (error) {
      this.logger.error(
        {
          message: `Error: ${error.message}`,
          owner,
          resource,
          actions,
        },
        error.stack,
        this.loggerContext,
      );
      throw new CouldNotCreateAccessRuleError();
    }

    return true;
  }

  public async reloadPolicy(): Promise<void> {
    await this.enforcer.loadPolicy();
  }

  public async getPolicy(): Promise<string[][]> {
    return this.enforcer.getPolicy();
  }

  public async enforce(...params: string[]): Promise<boolean> {
    return this.enforcer.enforce(...params);
  }

  public async getAllRoles(): Promise<string[]> {
    return this.enforcer.getAllRoles();
  }

  // public async addPolicy(...params: string[]) {
  //   const added = await this.enforcer.addPolicy(...params);
  //   if (added) {
  //     await this.enforcer.savePolicy();
  //   }
  // }

  // public async removePolicy(...params: string[]) {
  //   const removed = await this.enforcer.removePolicy(...params);
  //   if (removed) {
  //     await this.enforcer.savePolicy();
  //   }
  // }

  public async getAllObjects(): Promise<string[]> {
    return this.enforcer.getAllObjects();
  }

  public async getAllSubjects(): Promise<string[]> {
    return this.enforcer.getAllSubjects();
  }

  public async getUsersForRole(name: string, domain?: string): Promise<string[]> {
    return this.enforcer.getUsersForRole(name, domain);
  }

  public async hasRoleForUser(user: string, role: string, domain?: string): Promise<boolean> {
    return this.enforcer.hasRoleForUser(user, role, domain);
  }

  public async addRoleForUser(user: string, role: string, domain?: string): Promise<boolean> {
    return this.enforcer.addRoleForUser(user, role, domain);
  }

  public async deleteRoleForUser(user: string, role: string, domain?: string): Promise<boolean> {
    return this.enforcer.deleteRoleForUser(user, role, domain);
  }

  public async deleteRolesForUser(user: string, domain?: string): Promise<boolean> {
    return this.enforcer.deleteRolesForUser(user, domain);
  }

  public async deleteUser(user: string): Promise<boolean> {
    return this.enforcer.deleteUser(user);
  }

  public async deleteRole(role: string): Promise<boolean> {
    return this.enforcer.deleteRole(role);
  }

  public async deletePermission(...permissions: string[]): Promise<boolean> {
    return this.enforcer.deletePermission(...permissions);
  }

  public async addPermissionForUser(user: string, ...permissions: string[]): Promise<boolean> {
    return this.enforcer.addPermissionForUser(user, ...permissions);
  }

  public async deletePermissionForUser(user: string, ...permissions: string[]): Promise<boolean> {
    return this.enforcer.deletePermissionForUser(user, ...permissions);
  }

  public async deletePermissionsForUser(user: string): Promise<boolean> {
    return this.enforcer.deletePermissionsForUser(user);
  }

  public async getPermissionsForUser(user: string): Promise<string[][]> {
    return this.enforcer.getPermissionsForUser(user);
  }

  public async hasPermissionForUser(user: string, ...permissions: string[]): Promise<boolean> {
    return await this.enforcer.hasPermissionForUser(user, ...permissions);
  }

  public async getAllActions(): Promise<string[]> {
    return this.enforcer.getAllActions();
  }

  public async hasPolicy(...params: string[]): Promise<boolean> {
    return await this.enforcer.hasPolicy(...params);
  }

  public async hasNamedPolicy(p: string, ...params: string[]): Promise<boolean> {
    return await this.enforcer.hasNamedPolicy(p, ...params);
  }

  public async getRolesForUser(name: string, domain?: string): Promise<string[]> {
    return await this.enforcer.getRolesForUser(name, domain);
  }

  public async getImplicitPermissionsForUser(
    name: string,
    ...domain: string[]
  ): Promise<string[][]> {
    return await this.enforcer.getImplicitPermissionsForUser(name, ...domain);
  }

  public async getImplicitRolesForUser(name: string, ...domain: string[]): Promise<string[]> {
    return await this.enforcer.getImplicitRolesForUser(name, ...domain);
  }

  public async getNamedPolicy(name: string): Promise<string[][]> {
    return await this.enforcer.getNamedPolicy(name);
  }

  public async addFunction(name: string, fn: any): Promise<void> {
    return await this.enforcer.addFunction(name, fn);
  }

  enableAutoBuildRoleLinks(autoBuildRoleLinks: boolean): void {
    return this.enforcer.enableAutoBuildRoleLinks(autoBuildRoleLinks);
  }

  isFiltered(): boolean {
    return this.enforcer.isFiltered();
  }

  enableAutoSave(autoSave: boolean): void {
    return this.enforcer.enableAutoSave(autoSave);
  }

  enableLog(enable: boolean): void {
    return this.enforcer.enableLog(enable);
  }

  enableEnforce(enable: boolean): void {
    return this.enforcer.enableEnforce(enable);
  }

  clearPolicy(): void {
    return this.enforcer.clearPolicy();
  }

  addGroupingPolicy(): Promise<boolean> {
    return this.enforcer.addGroupingPolicy();
  }

  // the operation will look like `await this.enforcer.getAdapter().enforce()`
  public async checkPermission(...params: any[]) {
    return this.enforcer.enforce(...params);
  }

  private buildPolicy(policy: PolicyDto): string[] {
    const { resourceOwnerName, resourceOwnerId, resourceName, resourceId } = policy;

    const owner = `role:${resourceOwnerName}/${resourceOwnerId}`;
    const resource = `resource:${resourceName}/${resourceId}`;
    const actions = 'GET';
    return [owner, resource, actions];
  }

  private buildResource(name: ResourceNameEnum, id: number): string {
    return `resource:${name}/${id}`;
  }

  private buildRole(name: ResourceNameEnum, id: number): string {
    return `role:${name}/${id}`;
  }
}
