import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EndpointsEntities } from "./EndpointsEntities";

@Index("body_param_entities_pkey", ["id"], { unique: true })
@Entity("body_param_entities", { schema: "public" })
export class BodyParamEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "content_type", length: 255 })
  contentType: string;

  @Column("text", { name: "text_body", nullable: true })
  textBody: string | null;

  @Column("bigint", { name: "media_file_id", nullable: true })
  mediaFileId: string | null;

  @ManyToOne(
    () => EndpointsEntities,
    (endpointsEntities) => endpointsEntities.bodyParamEntities
  )
  @JoinColumn([{ name: "endpoint_id", referencedColumnName: "id" }])
  endpoint: EndpointsEntities;

  @ManyToOne(
    () => EndpointsEntities,
    (endpointsEntities) => endpointsEntities.bodyParamEntities2
  )
  @JoinColumn([{ name: "endpoint_id", referencedColumnName: "id" }])
  endpoint_2: EndpointsEntities;
}
