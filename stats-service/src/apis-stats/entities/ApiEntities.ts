import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiCollectionEntities } from "./ApiCollectionEntities";
import { ApiDocsEntities } from "./ApiDocsEntities";
import { CategoryEntities } from "./CategoryEntities";
import { ApiRatingEntities } from "./ApiRatingEntities";
import { ApiVersionEntities } from "./ApiVersionEntities";
import { EndpointsGroupEntities } from "./EndpointsGroupEntities";
import { HealthCheckEntities } from "./HealthCheckEntities";
import { ObjectPlanEntities } from "./ObjectPlanEntities";
import { PlanEntities } from "./PlanEntities";

@Index("api_entities_pkey", ["id"], { unique: true })
@Entity("api_entities", { schema: "public" })
export class ApiEntities {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "provider_id" })
  providerId: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "image_path", nullable: true })
  imagePath: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 20,
    default: () => "'active'",
  })
  status: string | null;

  @Column("timestamp with time zone", {
    name: "date_created",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  dateCreated: Date | null;

  @Column("timestamp with time zone", { name: "last_updated", nullable: true })
  lastUpdated: Date | null;

  @Column("timestamp with time zone", { name: "date_deleted", nullable: true })
  dateDeleted: Date | null;

  @Column("text", { name: "keywords", nullable: true })
  keywords: string | null;

  @Column("text", { name: "api_url", nullable: true })
  apiUrl: string | null;

  @Column("boolean", {
    name: "visibility",
    nullable: true,
    default: () => "false",
  })
  visibility: boolean | null;

  @ManyToMany(
    () => ApiCollectionEntities,
    (apiCollectionEntities) => apiCollectionEntities.apiEntities
  )
  apiCollectionEntities: ApiCollectionEntities[];

  @OneToMany(() => ApiDocsEntities, (apiDocsEntities) => apiDocsEntities.api)
  apiDocsEntities: ApiDocsEntities[];

  @ManyToOne(
    () => CategoryEntities,
    (categoryEntities) => categoryEntities.apiEntities
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: CategoryEntities;

  @OneToMany(
    () => ApiRatingEntities,
    (apiRatingEntities) => apiRatingEntities.api
  )
  apiRatingEntities: ApiRatingEntities[];

  @OneToMany(
    () => ApiVersionEntities,
    (apiVersionEntities) => apiVersionEntities.api
  )
  apiVersionEntities: ApiVersionEntities[];

  @OneToMany(
    () => EndpointsGroupEntities,
    (endpointsGroupEntities) => endpointsGroupEntities.api
  )
  endpointsGroupEntities: EndpointsGroupEntities[];

  @OneToOne(
    () => HealthCheckEntities,
    (healthCheckEntities) => healthCheckEntities.api
  )
  healthCheckEntities: HealthCheckEntities;

  @OneToMany(
    () => ObjectPlanEntities,
    (objectPlanEntities) => objectPlanEntities.api
  )
  objectPlanEntities: ObjectPlanEntities[];

  @OneToMany(() => PlanEntities, (planEntities) => planEntities.api)
  planEntities: PlanEntities[];
}
