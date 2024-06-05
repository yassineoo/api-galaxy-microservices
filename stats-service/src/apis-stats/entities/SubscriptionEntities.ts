import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanEntities } from "./PlanEntities";
import { UsageLogEntities } from "./UsageLogEntities";

@Index("subscription_entities_pkey", ["id"], { unique: true })
@Entity("subscription_entities", { schema: "public" })
export class SubscriptionEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "user_id" })
  userId: string;

  @Column("timestamp with time zone", { name: "start_date", nullable: true })
  startDate: Date | null;

  @Column("timestamp with time zone", { name: "end_date", nullable: true })
  endDate: Date | null;

  @Column("bigint", { name: "used_calls", nullable: true })
  usedCalls: string | null;

  @Column("character varying", { name: "status", nullable: true, length: 50 })
  status: string | null;

  @ManyToOne(
    () => PlanEntities,
    (planEntities) => planEntities.subscriptionEntities
  )
  @JoinColumn([{ name: "plan_id", referencedColumnName: "id" }])
  plan: PlanEntities;

  @OneToMany(
    () => UsageLogEntities,
    (usageLogEntities) => usageLogEntities.subscription
  )
  usageLogEntities: UsageLogEntities[];
}
