import { MigrationInterface, QueryRunner } from 'typeorm';

export class Operation1684079482194 implements MigrationInterface {
  name = 'Operation1684079482194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."operation_type_enum" AS ENUM('Income', 'Outcome')`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" uuid NOT NULL, "description" character varying(300) COLLATE "C", "amount" bigint NOT NULL, "type" "public"."operation_type_enum" NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
  }
}
