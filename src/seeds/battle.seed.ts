import { Factory, Seeder } from 'typeorm-seeding';
import { Config } from '../entities/config.entity';
import { Connection } from 'typeorm';
import { User } from '../entities/user.entity';
import { Army } from '../entities/army.entity';
import { Squad } from '../entities/squad.entity';
import { Soldier } from '../entities/soldier.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Operator } from '../entities/operator.entity';
import { ConfigActive } from '../entities/config.active';

export class CreateBattle implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const config = await factory(Config)()
      .map(async config => {
        await factory(ConfigActive)()
          .map(async activeConfig => {
            activeConfig.configId = config.id;

            return activeConfig;
          })
          .create();

        return config;
      })
      .create();

    const users = await factory(User)()
      .map(async user => {
        const army = await factory(Army)()
          .map(async army => {
            army.userId = user.id;

            const squads = await factory(Squad)()
              .map(async squad => {
                squad.armyId = army.id;

                const soldiers = await factory(Soldier)()
                  .map(async soldier => {
                    soldier.squadId = squad.id;

                    return soldier;
                  })
                  .createMany(5);

                const vehicles = await factory(Vehicle)()
                  .map(async vehicle => {
                    vehicle.squadId = squad.id;

                    const operators = await factory(Operator)()
                      .map(async operator => {
                        operator.vehicleId = vehicle.id;

                        return operator;
                      })
                      .createMany(2);

                    vehicle.operators = operators;

                    return vehicle;
                  })
                  .createMany(2);

                squad.vehicles = vehicles;
                squad.soldiers = soldiers;

                return squad;
              })
              .createMany(3);

            army.squads = squads;

            return army;
          })
          .create();

        return user;
      })
      .createMany(10);

    // const tournament = await factory(Tournament)()
    //   .map(async t => {
    //     t.state = TournamentState.Playable;
    //     return t;
    //   })
    //   .create();
    // const teams = await factory(Team)()
    //   .map(async team => {
    //     team.tournament = tournament;
    //     return team;
    //   })
    //   .createMany(4);
    //
    // const gamePlans = [
    //   [1, 0, 1],
    //   [1, 2, 3],
    //   [2, 0, 2],
    //   [2, 1, 3],
    //   [3, 3, 0],
    //   [3, 1, 2],
    // ];
    //
    // for (const plan of gamePlans) {
    //   await factory(Game)()
    //     .map(async game => {
    //       game.tournament = tournament;
    //       game.round = plan[0];
    //       game.host = teams[plan[1]];
    //       game.guest = teams[plan[2]];
    //       return game;
    //     })
    //     .create();
    // }
  }
}
