import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiEntities } from "./ApiEntities";

@Index("category_entities_pkey", ["id"], { unique: true })
@Entity("category_entities", { schema: "public" })
export class CategoryEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "category_name", length: 255 })
  categoryName: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => ApiEntities, (apiEntities) => apiEntities.category)
  apiEntities: ApiEntities[];
}
