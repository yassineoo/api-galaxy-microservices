import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BodyParamEntities } from "./BodyParamEntities";
import { EndpointsGroupEntities } from "./EndpointsGroupEntities";
import { EndpointsParameterEntities } from "./EndpointsParameterEntities";
import { HealthCheckEntities } from "./HealthCheckEntities";
import { UsageLogEntities } from "./UsageLogEntities";

@Index("endpoints_entities_pkey", ["id"], { unique: true })
@Entity("endpoints_entities", { schema: "public" })
export class EndpointsEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "methode", length: 255 })
  methode: string;

  @Column("character varying", { name: "url", length: 255 })
  url: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("character varying", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @OneToMany(
    () => BodyParamEntities,
    (bodyParamEntities) => bodyParamEntities.endpoint
  )
  bodyParamEntities: BodyParamEntities[];

  @OneToMany(
    () => BodyParamEntities,
    (bodyParamEntities) => bodyParamEntities.endpoint_2
  )
  bodyParamEntities2: BodyParamEntities[];

  @ManyToOne(
    () => EndpointsGroupEntities,
    (endpointsGroupEntities) => endpointsGroupEntities.endpointsEntities
  )
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: EndpointsGroupEntities;

  @OneToMany(
    () => EndpointsParameterEntities,
    (endpointsParameterEntities) => endpointsParameterEntities.endpoint
  )
  endpointsParameterEntities: EndpointsParameterEntities[];

  @OneToMany(
    () => HealthCheckEntities,
    (healthCheckEntities) => healthCheckEntities.endpoint
  )
  healthCheckEntities: HealthCheckEntities[];

  @OneToMany(
    () => UsageLogEntities,
    (usageLogEntities) => usageLogEntities.endpoint
  )
  usageLogEntities: UsageLogEntities[];
}
