import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectPlanEntities } from "./ObjectPlanEntities";

@Index("endpoint_object_entities_pkey", ["id"], { unique: true })
@Entity("endpoint_object_entities", { schema: "public" })
export class EndpointObjectEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "endpoints_id" })
  endpointsId: string;

  @ManyToOne(
    () => ObjectPlanEntities,
    (objectPlanEntities) => objectPlanEntities.endpointObjectEntities
  )
  @JoinColumn([{ name: "object_id", referencedColumnName: "id" }])
  object: ObjectPlanEntities;
}
