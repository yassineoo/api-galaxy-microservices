import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EndpointsEntities } from "./EndpointsEntities";
import { ApiEntities } from "./ApiEntities";

@Index("endpoints_group_entities_pkey", ["id"], { unique: true })
@Entity("endpoints_group_entities", { schema: "public" })
export class EndpointsGroupEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("text", { name: "group", nullable: true })
  group: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(
    () => EndpointsEntities,
    (endpointsEntities) => endpointsEntities.group
  )
  endpointsEntities: EndpointsEntities[];

  @ManyToOne(
    () => ApiEntities,
    (apiEntities) => apiEntities.endpointsGroupEntities,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "api_id", referencedColumnName: "id" }])
  api: ApiEntities;
}
