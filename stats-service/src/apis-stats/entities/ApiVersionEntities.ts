import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiEntities } from "./ApiEntities";

@Index("api_version_entities_pkey", ["id"], { unique: true })
@Entity("api_version_entities", { schema: "public" })
export class ApiVersionEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "version_number", length: 255 })
  versionNumber: string;

  @Column("timestamp with time zone", { name: "release_date", nullable: true })
  releaseDate: Date | null;

  @Column("text", { name: "whats_new", nullable: true })
  whatsNew: string | null;

  @ManyToOne(() => ApiEntities, (apiEntities) => apiEntities.apiVersionEntities)
  @JoinColumn([{ name: "api_id", referencedColumnName: "id" }])
  api: ApiEntities;
}
