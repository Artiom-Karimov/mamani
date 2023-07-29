import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1690659393415 implements MigrationInterface {
  name = 'Init1690659393415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "userId" uuid NOT NULL, "name" character varying(100) COLLATE "C" NOT NULL, "description" character varying(300) COLLATE "C", "default" boolean NOT NULL DEFAULT false, "color" character varying(20) COLLATE "C", CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "email" character varying(200) COLLATE "C" NOT NULL, "firstName" character varying(100) COLLATE "C" NOT NULL, "lastName" character varying(100) COLLATE "C" NOT NULL, "hash" character varying(200) COLLATE "C" NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."category_type_enum" AS ENUM('Income', 'Expence')`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "type" "public"."category_type_enum" NOT NULL, "name" character varying(50) COLLATE "C" NOT NULL, "description" character varying(300) COLLATE "C", "color" character varying(20) COLLATE "C", "userId" uuid, "parentId" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."operation_type_enum" AS ENUM('Income', 'Expence')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "accountId" uuid NOT NULL, "description" character varying(300) COLLATE "C", "amount" bigint NOT NULL, "type" "public"."operation_type_enum" NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_32b856438dffdc269fa84434d9f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" ADD CONSTRAINT "FK_5a1cec203fc9280aea0ab3128bc" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" ADD CONSTRAINT "FK_54d44174fb89e86a63f2f226cdf" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operation" DROP CONSTRAINT "FK_54d44174fb89e86a63f2f226cdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" DROP CONSTRAINT "FK_5a1cec203fc9280aea0ab3128bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_32b856438dffdc269fa84434d9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TYPE "public"."category_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
