import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EndpointsEntities } from "./EndpointsEntities";

@Index("endpoints_parameter_entities_pkey", ["id"], { unique: true })
@Entity("endpoints_parameter_entities", { schema: "public" })
export class EndpointsParameterEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "key", length: 255 })
  key: string;

  @Column("character varying", {
    name: "value_type",
    nullable: true,
    length: 255,
  })
  valueType: string | null;

  @Column("character varying", {
    name: "parameter_type",
    nullable: true,
    length: 255,
  })
  parameterType: string | null;

  @Column("character varying", {
    name: "example_value",
    nullable: true,
    length: 255,
  })
  exampleValue: string | null;

  @Column("boolean", {
    name: "required",
    nullable: true,
    default: () => "false",
  })
  required: boolean | null;

  @ManyToOne(
    () => EndpointsEntities,
    (endpointsEntities) => endpointsEntities.endpointsParameterEntities
  )
  @JoinColumn([{ name: "endpoint_id", referencedColumnName: "id" }])
  endpoint: EndpointsEntities;
}
