import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiEntities } from "./ApiEntities";

@Index("api_docs_entities_pkey", ["id"], { unique: true })
@Entity("api_docs_entities", { schema: "public" })
export class ApiDocsEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("text", { name: "content", nullable: true })
  content: string | null;

  @Column("timestamp with time zone", {
    name: "last_updated",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  lastUpdated: Date | null;

  @ManyToOne(() => ApiEntities, (apiEntities) => apiEntities.apiDocsEntities)
  @JoinColumn([{ name: "api_id", referencedColumnName: "id" }])
  api: ApiEntities;
}
