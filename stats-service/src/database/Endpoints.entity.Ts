/*
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class EndpointsEntity {
  @PrimaryGeneratedColumn()
  ID!: number;

  @Column({ nullable: false })
  GroupID!: number;

  @Column({ length: 255, nullable: false })
  Methode!: string;

  @Column()
  Name?: string;

  @Column({ length: 255, nullable: false })
  Url!: string;

  @Column()
  Description?: string;

  @ManyToOne(() => EndpointsGroupEntity, (group) => group.Endpoints)
  @JoinColumn({ name: 'GroupID' })
  Group?: EndpointsGroupEntity;

  @OneToMany(
    () => EndpointsParameterEntity,
    (parameter) => parameter.Endpoint,
    { cascade: true },
  )
  Parameters?: EndpointsParameterEntity[];

  @OneToOne(() => BodyParamEntity, (bodyParam) => bodyParam.Endpoint, {
    cascade: true,
  })
  @JoinColumn()
  BodyParam?: BodyParamEntity;

  @OneToMany(() => UsageLogEntity, (log) => log.Endpoint)
  Logs?: UsageLogEntity[];

  @OneToMany(() => HealthCheckEntity, (check) => check.Endpoint)
  HealthCheck?: HealthCheckEntity[];

  // Add other relationships and columns as needed
}
*/
