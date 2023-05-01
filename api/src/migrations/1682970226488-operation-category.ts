import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperationCategory1682970226488 implements MigrationInterface {
  name = 'OperationCategory1682970226488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."operation_category_type_enum" AS ENUM('Income', 'Outcome')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."operation_category_type_enum" NOT NULL, "name" character varying(50) COLLATE "C" NOT NULL, "description" character varying(300) COLLATE "C", "color" character varying(20) COLLATE "C", "userId" uuid, "parentId" uuid, CONSTRAINT "PK_ed4597aefea6bb1448a6e7fca85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation_category" ADD CONSTRAINT "FK_0f74eb3e12ecf9df36469a411c7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation_category" ADD CONSTRAINT "FK_1d9735261534aaa5da22f2f2f56" FOREIGN KEY ("parentId") REFERENCES "operation_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operation_category" DROP CONSTRAINT "FK_1d9735261534aaa5da22f2f2f56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation_category" DROP CONSTRAINT "FK_0f74eb3e12ecf9df36469a411c7"`,
    );
    await queryRunner.query(`DROP TABLE "operation_category"`);
    await queryRunner.query(
      `DROP TYPE "public"."operation_category_type_enum"`,
    );
  }
}
