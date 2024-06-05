import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiEntities } from "./ApiEntities";
import { EndpointsEntities } from "./EndpointsEntities";
import { HealthCheckResultEntities } from "./HealthCheckResultEntities";

@Index("health_check_entities_api_id_key", ["apiId"], { unique: true })
@Index("health_check_entities_pkey", ["id"], { unique: true })
@Entity("health_check_entities", { schema: "public" })
export class HealthCheckEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "api_id", unique: true })
  apiId: string;

  @Column("character varying", { name: "schedule", nullable: true, length: 50 })
  schedule: string | null;

  @Column("character varying", {
    name: "last_status",
    nullable: true,
    length: 20,
    default: () => "'pending'",
  })
  lastStatus: string | null;

  @Column("timestamp with time zone", {
    name: "last_checked_at",
    nullable: true,
  })
  lastCheckedAt: Date | null;

  @Column("boolean", { name: "alerts_enabled", nullable: true })
  alertsEnabled: boolean | null;

  @Column("text", { name: "email", nullable: true })
  email: string | null;

  @OneToOne(() => ApiEntities, (apiEntities) => apiEntities.healthCheckEntities)
  @JoinColumn([{ name: "api_id", referencedColumnName: "id" }])
  api: ApiEntities;

  @ManyToOne(
    () => EndpointsEntities,
    (endpointsEntities) => endpointsEntities.healthCheckEntities
  )
  @JoinColumn([{ name: "endpoint_id", referencedColumnName: "id" }])
  endpoint: EndpointsEntities;

  @OneToMany(
    () => HealthCheckResultEntities,
    (healthCheckResultEntities) => healthCheckResultEntities.healthCheck
  )
  healthCheckResultEntities: HealthCheckResultEntities[];
}
