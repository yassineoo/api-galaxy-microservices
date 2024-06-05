import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiEntities } from "./ApiEntities";

@Index("api_collection_entities_pkey", ["id"], { unique: true })
@Entity("api_collection_entities", { schema: "public" })
export class ApiCollectionEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { name: "image_path", nullable: true })
  imagePath: string | null;

  @ManyToMany(
    () => ApiEntities,
    (apiEntities) => apiEntities.apiCollectionEntities
  )
  @JoinTable({
    name: "api_collections_apis",
    joinColumns: [
      { name: "api_collection_entity_id", referencedColumnName: "id" },
    ],
    inverseJoinColumns: [{ name: "api_entity_id", referencedColumnName: "id" }],
    schema: "public",
  })
  apiEntities: ApiEntities[];
}
