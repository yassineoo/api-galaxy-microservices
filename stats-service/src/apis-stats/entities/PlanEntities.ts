import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiEntities } from "./ApiEntities";
import { SubscriptionEntities } from "./SubscriptionEntities";

@Index("plan_entities_pkey", ["id"], { unique: true })
@Entity("plan_entities", { schema: "public" })
export class PlanEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("boolean", { name: "active", nullable: true })
  active: boolean | null;

  @Column("boolean", { name: "visibility", nullable: true })
  visibility: boolean | null;

  @Column("text", { name: "type", nullable: true })
  type: string | null;

  @Column("bigint", { name: "rate", nullable: true })
  rate: string | null;

  @Column("text", { name: "rate_unite", nullable: true })
  rateUnite: string | null;

  @Column("boolean", { name: "recomnded_plan", nullable: true })
  recomndedPlan: boolean | null;

  @Column("numeric", { name: "price", nullable: true, precision: 10, scale: 2 })
  price: string | null;

  @ManyToOne(() => ApiEntities, (apiEntities) => apiEntities.planEntities)
  @JoinColumn([{ name: "api_id", referencedColumnName: "id" }])
  api: ApiEntities;

  @OneToMany(
    () => SubscriptionEntities,
    (subscriptionEntities) => subscriptionEntities.plan
  )
  subscriptionEntities: SubscriptionEntities[];
}
