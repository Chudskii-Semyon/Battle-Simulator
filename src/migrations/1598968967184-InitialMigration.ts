import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1598968967184 implements MigrationInterface {
    name = 'InitialMigration1598968967184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_065d4d8f3b5adb4a08841eae3c" ON "user" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "operator" ("id" SERIAL NOT NULL, "experience" integer NOT NULL DEFAULT 0, "healthPoints" integer NOT NULL DEFAULT 100, "recharge" integer NOT NULL DEFAULT 1500, "vehicleId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8b950e1572745d9f69be7748ae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "healthPoints" integer NOT NULL DEFAULT 100, "recharge" integer NOT NULL DEFAULT 2000, "squadId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "soldier" ("id" SERIAL NOT NULL, "experience" integer NOT NULL DEFAULT 0, "healthPoints" integer NOT NULL DEFAULT 100, "recharge" integer NOT NULL DEFAULT 1500, "squadId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af604e3372237f9e1513a2fda6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "squad_strategy_enum" AS ENUM('RANDOM', 'WEAKEST', 'STRONGEST')`);
        await queryRunner.query(`CREATE TABLE "squad" ("id" SERIAL NOT NULL, "strategy" "squad_strategy_enum" NOT NULL DEFAULT 'RANDOM', "armyId" integer NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_90e924b0dbb125f974606646bce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "army" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_df0660fe9965fe55cbb6423046" UNIQUE ("userId"), CONSTRAINT "PK_7653a2aa639b3639910bc29c4de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "casbin_rule" ("id" SERIAL NOT NULL, "ptype" character varying NOT NULL, "v0" character varying NOT NULL, "v1" character varying NOT NULL, "v2" character varying, "v3" character varying, "v4" character varying, "v5" character varying, CONSTRAINT "PK_e147354d31e2748a3a5da5e3060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "config" ("id" SERIAL NOT NULL, "maxHealthPoints" integer NOT NULL DEFAULT 100, "numberOfUnitsPerSquad" integer NOT NULL DEFAULT 12, "numberOfSquadsPerArmy" integer NOT NULL DEFAULT 4, CONSTRAINT "PK_d0ee79a681413d50b0a4f98cf7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "config_active" ("id" SERIAL NOT NULL, "configId" integer NOT NULL, CONSTRAINT "UQ_f2130ff4380271b3abd73779d8e" UNIQUE ("configId"), CONSTRAINT "REL_f2130ff4380271b3abd73779d8" UNIQUE ("configId"), CONSTRAINT "PK_df96b069af26c2c6a1ff15f9909" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "operator" ADD CONSTRAINT "FK_9bd11e8d1d359df4603a2e5b72d" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_3e1feebf81fc81805cf570dc1dc" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soldier" ADD CONSTRAINT "FK_d5e3ccafa1fc29e8ac45b6869f8" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "squad" ADD CONSTRAINT "FK_ee81a1c267e2438cc598c901b59" FOREIGN KEY ("armyId") REFERENCES "army"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "army" ADD CONSTRAINT "FK_df0660fe9965fe55cbb64230463" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "config_active" ADD CONSTRAINT "FK_f2130ff4380271b3abd73779d8e" FOREIGN KEY ("configId") REFERENCES "config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "config_active" DROP CONSTRAINT "FK_f2130ff4380271b3abd73779d8e"`);
        await queryRunner.query(`ALTER TABLE "army" DROP CONSTRAINT "FK_df0660fe9965fe55cbb64230463"`);
        await queryRunner.query(`ALTER TABLE "squad" DROP CONSTRAINT "FK_ee81a1c267e2438cc598c901b59"`);
        await queryRunner.query(`ALTER TABLE "soldier" DROP CONSTRAINT "FK_d5e3ccafa1fc29e8ac45b6869f8"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_3e1feebf81fc81805cf570dc1dc"`);
        await queryRunner.query(`ALTER TABLE "operator" DROP CONSTRAINT "FK_9bd11e8d1d359df4603a2e5b72d"`);
        await queryRunner.query(`DROP TABLE "config_active"`);
        await queryRunner.query(`DROP TABLE "config"`);
        await queryRunner.query(`DROP TABLE "casbin_rule"`);
        await queryRunner.query(`DROP TABLE "army"`);
        await queryRunner.query(`DROP TABLE "squad"`);
        await queryRunner.query(`DROP TYPE "squad_strategy_enum"`);
        await queryRunner.query(`DROP TABLE "soldier"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "operator"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_065d4d8f3b5adb4a08841eae3c"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
