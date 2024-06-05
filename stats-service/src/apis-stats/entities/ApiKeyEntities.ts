import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("api_key_entities_api_key_key", ["apiKey"], { unique: true })
@Index("api_key_entities_pkey", ["id"], { unique: true })
@Entity("api_key_entities", { schema: "public" })
export class ApiKeyEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "subscription_id" })
  subscriptionId: string;

  @Column("character varying", { name: "api_key", unique: true, length: 255 })
  apiKey: string;

  @Column("timestamp with time zone", {
    name: "creation_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  creationDate: Date | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;
}
