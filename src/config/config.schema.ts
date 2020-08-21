import { join } from 'path';

export const schema = {
  port: {
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  auth: {
    secret: {
      format: String,
      default: 'secret',
      env: 'AUTH_TOKEN_SECRET',
    },
    expirationTimeSeconds: {
      format: Number,
      default: 60 * 60, // 3600 -> one hour
      env: 'AUTH_TOKEN_EXPIRATION_TIME_SECONDS',
    },
  },
  casbinEnforcer: {
    pathToModel: {
      format: String,
      default: join(process.cwd(), '/src/casbin-conf/model.conf'),
    },
  },
  typeorm: {
    type: {
      format: String,
      default: 'postgres',
      env: 'TYPEORM_CONNECTION',
    },
    host: {
      format: String,
      default: 'localhost',
      env: 'TYPEORM_HOST',
    },
    port: {
      format: Number,
      default: 5432,
      env: 'TYPEORM_PORT',
    },
    username: {
      format: String,
      default: 'postgres',
      env: 'TYPEORM_USERNAME',
    },
    password: {
      format: String,
      default: '',
      env: 'TYPEORM_PASSWORD',
    },
    database: {
      format: String,
      default: 'battle_simulator_database',
      env: 'TYPEORM_DATABASE',
    },
  },
  unitDefaults: {
    unitRechargeTime: {
      vehicle: {
        format: Number,
        default: 2000,
        env: 'VEHICLE_DEFAULT_RECHARGE_MILISECONDS',
      },
      soldier: {
        format: Number,
        default: 1500,
        env: 'SOLDIER_DEFAULT_RECHARGE_MILISECONDS',
      },
    },
    unitHealthPoints: {
      vehicle: {
        format: Number,
        default: 100,
        env: 'VEHICLE_DEFAULT_HEALTH_POINTS',
      },
      soldier: {
        format: Number,
        default: 100,
        env: 'SOLDIER_DEFAULT_HEALTH_POINTS',
      },
    },
  },
};
