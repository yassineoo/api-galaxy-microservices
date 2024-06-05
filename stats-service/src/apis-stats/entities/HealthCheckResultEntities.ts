import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HealthCheckEntities } from "./HealthCheckEntities";

@Index("health_check_result_entities_pkey", ["id"], { unique: true })
@Entity("health_check_result_entities", { schema: "public" })
export class HealthCheckResultEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "status", length: 20 })
  status: string;

  @Column("bigint", { name: "response_time", nullable: true })
  responseTime: string | null;

  @Column("text", { name: "status_message", nullable: true })
  statusMessage: string | null;

  @Column("timestamp with time zone", {
    name: "checked_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  checkedAt: Date | null;

  @ManyToOne(
    () => HealthCheckEntities,
    (healthCheckEntities) => healthCheckEntities.healthCheckResultEntities
  )
  @JoinColumn([{ name: "health_check_id", referencedColumnName: "id" }])
  healthCheck: HealthCheckEntities;
}
