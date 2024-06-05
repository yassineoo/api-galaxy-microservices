import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CrossObjectEntities } from "./CrossObjectEntities";
import { EndpointObjectEntities } from "./EndpointObjectEntities";
import { ApiEntities } from "./ApiEntities";

@Index("object_plan_entities_pkey", ["id"], { unique: true })
@Entity("object_plan_entities", { schema: "public" })
export class ObjectPlanEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("boolean", { name: "all_endpoints", nullable: true })
  allEndpoints: boolean | null;

  @OneToMany(
    () => CrossObjectEntities,
    (crossObjectEntities) => crossObjectEntities.object
  )
  crossObjectEntities: CrossObjectEntities[];

  @OneToMany(
    () => EndpointObjectEntities,
    (endpointObjectEntities) => endpointObjectEntities.object
  )
  endpointObjectEntities: EndpointObjectEntities[];

  @ManyToOne(() => ApiEntities, (apiEntities) => apiEntities.objectPlanEntities)
  @JoinColumn([{ name: "api_id", referencedColumnName: "id" }])
  api: ApiEntities;
}
