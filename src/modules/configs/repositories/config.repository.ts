import { Config } from '../../../entities/config.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Config)
export class ConfigRepository extends Repository<Config> {
  public async findActiveConfig(): Promise<Config> {
    return this.createQueryBuilder('config')
      .leftJoinAndSelect('config.active', 'configActive')
      .getOne();
  }
}
