import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // constructor(private readonly accessControlService: AccessControlService) {}

  @Get()
  public async getHello(): Promise<string> {
    /*
    const adapter = await TypeORMAdapter.newAdapter({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'battle_simulator_database',
    });
    const model = join(process.cwd(), '/src/casbin-conf/model.conf');
    const enforcer = await newEnforcer(model, adapter);
*/

    // console.log(await enforcer.loadPolicy());

    // console.log(await enforcer.addPermissionForUser('role:army_1', 'squad_1', 'GET'));
    // await enforcer.addPermissionForUser('role:army_1', 'squad_2', 'GET');
    // await enforcer.addPermissionForUser('role:army_1', 'squad_3', 'GET');
    //
    // await enforcer.addPermissionForUser('role:squad_1', 'vehicle_1', 'GET');
    // await enforcer.addPermissionForUser('role:squad_1', 'vehicle_2', 'GET');
    // await enforcer.addPermissionForUser('role:squad_1', 'vehicle_3', 'GET');

    // await enforcer.addPermissionForUser('alice', 'test', 'GET');

    // await enforcer.addRoleForUser('role:army_1', 'role:squad_1');

    // await enforcer.addRoleForUser('alice', 'role:army_1');
    // await enforcer.savePolicy();

    // console.log(await enforcer.getImplicitPermissionsForUser('alice'));

    // const permissions = await enforcer.getImplicitPermissionsForUser('alice');

    // console.log(await enforcer.deletePermissionsForUser('alice'));
    // console.log(await enforcer.removePolicies(permissions));
    // console.log(await enforcer.deleteRolesForUser(permissions));
    // permissions.forEach(async p => {
    //   await enforcer.removePolicies()
    // })

    // if (await this.accessControlService.enforce('alice', 'vehicle_1', 'GET')) {
    //   return 'has access!';
    // }

    // await this.a
    // console.log(await this.accessControlService.getImplicitRolesForUser('alice'));
    // await this.enforcer.loadPolicy();
    // await this.accessControlService.addPermissionForUser('role:army_1', 'squad_1', 'GET');
    // await this.accessControlService.addPermissionForUser('role:army_1', 'squad_2', 'GET');
    // await this.accessControlService.addPermissionForUser('role:army_1', 'squad_3', 'GET');
    // //
    // await this.accessControlService.addPermissionForUser('role:squad_1', 'vehicle_1', 'GET');
    // await this.accessControlService.addPermissionForUser('role:squad_1', 'vehicle_2', 'GET');
    // await this.accessControlService.addPermissionForUser('role:squad_1', 'vehicle_3', 'GET');
    //
    // await this.accessControlService.addRoleForUser('role:army_1', 'role:squad_1');
    // //
    // await this.accessControlService.addRoleForUser('alice', 'role:army_1');
    // await this.enforcer.savePolicy();

    // console.log(await this.managementService.savePolicy());
    // console.log(await this.accessControlService.getPolicy());
    // console.log(await this.accessControlService.getAllRoles());
    // console.log('=====>', await this.accessControlService.getImplicitPermissionsForUser('alice'));
    // console.log('=====>', await this.accessControlService.getImplicitRolesForUser('alice'));
    // console.log('=====>', await this.accessControlService.getRolesForUser('alice'));

    // console.log(await this.enforcer.loadPolicy());

    // console.log('===============');

    // console.log('====>', await this.enforcer.getImplicitRolesForUser('alice'));
    // await this.enforcer.savePolicy();
    // console.log(await this.accessControlService.getPermissionsForUser('alice'));
    // console.log('=====>', await this.enforcer.enforce('alice', 'vehicle_1', 'GET'));
    // console.log(
    // '=====>',
    // console.log(await this.accessControlService.getImplicitPermissionsForUser('alice'));
    // );
    // console.log(await this.accessControlService.hasPermissionForUser('alice', 'vehicle_1', 'GET'));

    // if (await this.enforcer.enforce('alice', 'vehicle_1', 'GET')) {
    //   return 'has access';
    // }
    // console.log(await this.accessControlService.
    // await this.accessControlService.addPermissionForUser('role:army_1', 'squad_1', 'GET');
    // await this.accessControlService.addPermissionForUser('role:army_1', 'squad_2', 'GET');
    // await this.accessControlService.addPermissionForUser('role:army_1', 'squad_3', 'GET');
    //
    // await this.accessControlService.addPermissionForUser('role:squad_1', 'vehicle_1', 'GET');
    // await this.accessControlService.addPermissionForUser('role:squad_1', 'vehicle_2', 'GET');
    // await this.accessControlService.addPermissionForUser('role:squad_1', 'vehicle_3', 'GET');
    //
    // await this.accessControlService.addRoleForUser('role:army_1', 'role:squad_1');
    //
    // await this.accessControlService.addRoleForUser('alice', 'role:army_1');
    //
    // console.log(await this.accessControlService.savePolicy());
    // // console.log(await this.accessControlService.getPolicy());
    // // console.log(await this.accessControlService.getAllRoles());
    // console.log('=====>', await this.accessControlService.getImplicitPermissionsForUser('alice'));
    // console.log('=====>', await this.accessControlService.getImplicitRolesForUser('alice'));
    // console.log('=====>', await this.accessControlService.getRolesForUser('alice'));
    //
    // console.log(
    //   '=====>',
    //   await this.accessControlService.getImplicitPermissionsForUser('role:army_1'),
    // );
    //
    // console.log(await this.accessControlService.enforce('alice', 'vehicle_1', 'GET'));
    // console.log(await this.accessControlService.addNewAccessRule('squad', '2', 'army', '1'));
    // console.log(await this.accessControlService.addNewAccessRule('squad', '3', 'army', '1'));

    // console.log(await this.accessControlService.addNewAccessRule('vehicle', '1', 'squad', '1'));
    // console.log(await this.accessControlService.addNewAccessRule('vehicle', '2', 'squad', '1'));
    // console.log(await this.accessControlService.addNewAccessRule('vehicle', '3', 'squad', '1'));
    //

    // await this.accessControlService.savePolicy();
    // await this.accessControlService.addNamedPolicy('p', 'armies/1', 'armies/1/squads', 'read'),

    // await this.accessControlService.addPermissionForUser('armies/1/squads', 'data', 'read');
    // await this.accessControlService.addGroupingPolicy('armies/1/squads', 'armies/1/squads/1');
    // await this.accessControlService.addGroupingPolicy('armies/1/squads', 'armies/1/squads/2');
    // await this.accessControlService.addGroupingPolicy('armies/1/squads/2', 'armies/1/squads');

    // console.log(await this.accessControlService.addGroupingPolicy('army_1', 'squad_1'));
    // console.log(await this.accessControlService.getImplicitPermissionsForUser('armies/1'));
    // console.log(await this.accessControlService.getPermissionsForUser('armies/1'));
    // console.log(await this.accessControlService.getImplicitRolesForUser('armies/1'));
    // console.log(await this.accessControlService.getRolesForUser('armies/1'));
    // console.log(await this.accessControlService.getI(0, 'army_1'));

    // console.log(await this.accessControlService.getPermissionsForUser('army_1'));
    // await this.accessControlService.addPermissionForUser('armies/10', 'squads/1', 'GET');
    // await this.accessControlService.addPermissionForUser('armies/10', 'squads/2', 'GET');
    // await this.accessControlService.addPermissionForUser('armies/10', 'squads/3', 'GET');

    // await this.accessControlService.addRoleForUser('users/10', 'armies/10');
    // await this.accessControlService.addRoleForUser('armies/10', 'users/10');

    // const iRoles = await this.accessControlService.getImplicitPermissionsForUser('users/10');
    // const iPermissions = await this.accessControlService.getImplicitRolesForUser('users/10');
    // const roles = await this.accessControlService.getRolesForUser('users/10');
    // const permissions = await this.accessControlService.getPermissionsForUser('users/10');

    // console.log(iRoles);
    // console.log(iPermissions);
    // console.log(roles);
    // console.log(permissions);

    // if (await this.accessControlService.enforce('users/10', 'squads/10', 'GET')) {
    //   return 'has access';
    // }
    // const res = await this.accessControlService.getPermissionsForUser('someUser');
    // console.log(this.accessControlService.deletePermissionsForUser(res));
    // console.log(res);
    // const result = await this.rbacService.addRoleForUser('1', '/users/1', 'GET');
    // await this.rbacService.addRoleForUser('someUser', 'data', 'GET');
    // const result = await this.rbacService.addPermissionForUser('someUser', 'data', 'GET');

    // console.log('RESULT => ', result);

    // console.log('=>>>>>>', await this.rbacService.('1', '/users/1', 'GET'));
    // console.log(await this.rbacService.hasPermissionForUser('someUser', 'data', 'GET'));

    // console.log(await this.rbacService.getPermissionsForUser('someUser'));
    // this.accessControlService.de
    // console.log(await this.rbacService.hasPermissionForUser('someUser', '/users', 'GET'));
    // console.log(await this.rbacService.hasPermissionForUser('someUser', '/users/1', 'GET'));
    // console.log(await this.rbacService.hasPermissionForUser('someUser', '/users/1/1', 'GET'));
    // console.log(await this.rbacService.hasPermissionForUser('someUser', '/users/1/1/1', 'GET'));
    // await this.rbacService.addPermissionForUser('someUser', '/users', 'GET');
    // await this.rbacService.addPermissionForUser('someUser', '/users/1', 'GET');
    // await this.rbacService.addPermissionForUser('someUser', '/users/1/*', 'GET');
    // console.log('=>>>>>>', await this.rbacService.hasRoleForUser('someUser', 'data'));
    // console.log('=>>>>>>', await this.rbacService.getPermissionsForUser('someUser'));
    // console.log('=>>>>>>', await this.rbacService.getImplicitPermissionsForUser('someUser'));
    // console.log('=>>>>>>', await this.rbacService.getImplicitRolesForUser('someUser'));
    // console.log('=>>>>>>', await this.rbacService.getRolesForUser('someUser'));
    // const model = join(process.cwd(), '/src/casbin-conf/model.conf');

    // await this.enforcer.addPermissionForUser('user', '/data/1/*', 'GET');

    // console.log(this.accessControlService.getEnforcer());
    // console.log(await this.accessControlService.getPermissionsForUser('user'));
    // console.log(await this.accessControlService.enforce('user', '/data/1/1', 'GET'));
    // if (await this.accessControlService.enforce('user', '/data/1/adsfds/dsfdafadf', 'GET')) {
    //   if (await this.enforcer.hasPermissionForUser('user', '/data/1/adsfds', 'GET')) {
    // return 'has access';
    // }
    // const adapter = await NodeRedisAdapter.newAdapter({ host: '127.0.0.1', port: 6379 });
    // const enforcer = await newEnforcer(model, adapter);

    // await enforcer.addPermissionForUser('user', '/data', 'GET');
    // await enforcer.addPermissionForUser('user', '/data/*', 'GET');
    // enforcer.add
    // enforcer.sa
    // await adapter.addPolicy('1', 'users/1', 'GET');
    // const res = await enforcer.enforce(1, 'armies/1', 'read');
    // await enforcer.loadPolicy();
    // console.log('added policy => ', await enforcer.addPolicy('1', 'users/1', 'GET'));
    // const res = await enforcer.addRoleForUser('1', 'users/1', 'GET');

    // console.log(res);

    return 'hello';
  }
}
