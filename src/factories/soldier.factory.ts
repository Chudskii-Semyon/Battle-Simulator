import { define, factory } from 'typeorm-seeding';
import { Soldier } from '../entities/soldier.entity';
import { Squad } from '../entities/squad.entity';

define(Soldier, () => {
  // @ts-ignore
  const soldier = new Soldier();

  soldier.squad = factory(Squad)() as any;

  return soldier;
});
