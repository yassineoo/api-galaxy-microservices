import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EndpointsEntities } from "./EndpointsEntities";
import { SubscriptionEntities } from "./SubscriptionEntities";

@Index("usage_log_entities_pkey", ["id"], { unique: true })
@Entity("usage_log_entities", { schema: "public" })
export class UsageLogEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("timestamp with time zone", {
    name: "timestamp",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date | null;

  @Column("bigint", { name: "status", nullable: true })
  status: string | null;

  @Column("bigint", { name: "response_time", nullable: true })
  responseTime: string | null;

  @ManyToOne(
    () => EndpointsEntities,
    (endpointsEntities) => endpointsEntities.usageLogEntities
  )
  @JoinColumn([{ name: "endpoint_id", referencedColumnName: "id" }])
  endpoint: EndpointsEntities;

  @ManyToOne(
    () => SubscriptionEntities,
    (subscriptionEntities) => subscriptionEntities.usageLogEntities
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: SubscriptionEntities;
}
