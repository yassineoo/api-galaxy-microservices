import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiEntities } from "./ApiEntities";

@Index("api_rating_entities_pkey", ["id"], { unique: true })
@Entity("api_rating_entities", { schema: "public" })
export class ApiRatingEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "user_id" })
  userId: string;

  @Column("bigint", { name: "rating" })
  rating: string;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @Column("timestamp with time zone", {
    name: "date_rated",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  dateRated: Date | null;

  @ManyToOne(() => ApiEntities, (apiEntities) => apiEntities.apiRatingEntities)
  @JoinColumn([{ name: "api_id", referencedColumnName: "id" }])
  api: ApiEntities;
}
