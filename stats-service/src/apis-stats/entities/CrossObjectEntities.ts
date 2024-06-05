import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectPlanEntities } from "./ObjectPlanEntities";

@Index("cross_object_entities_pkey", ["id"], { unique: true })
@Entity("cross_object_entities", { schema: "public" })
export class CrossObjectEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "limit_fee", nullable: true })
  limitFee: string | null;

  @Column("text", { name: "limit_type", nullable: true })
  limitType: string | null;

  @Column("numeric", { name: "price", nullable: true, precision: 10, scale: 2 })
  price: string | null;

  @Column("text", { name: "quota_type", nullable: true })
  quotaType: string | null;

  @Column("bigint", { name: "quota_value", nullable: true })
  quotaValue: string | null;

  @Column("boolean", { name: "add", nullable: true, default: () => "false" })
  add: boolean | null;

  @ManyToOne(
    () => ObjectPlanEntities,
    (objectPlanEntities) => objectPlanEntities.crossObjectEntities
  )
  @JoinColumn([{ name: "object_id", referencedColumnName: "id" }])
  object: ObjectPlanEntities;
}
