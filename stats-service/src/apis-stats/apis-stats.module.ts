import { Module, Param } from '@nestjs/common';
import { ApisStatsService } from './apis-stats.service';
import { ApisStatsController } from './apis-stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiEntities } from './entities/ApiEntities';
import { CategoryEntities } from './entities/CategoryEntities';
import { ApiCollectionEntities } from './entities/ApiCollectionEntities';
import { EndpointsEntities } from './entities/EndpointsEntities';
import { EndpointsGroupEntities } from './entities/EndpointsGroupEntities';
import { EndpointsParameterEntities } from './entities/EndpointsParameterEntities';
import { HealthCheckEntities } from './entities/HealthCheckEntities';
import { HealthCheckResultEntities } from './entities/HealthCheckResultEntities';
import { BodyParamEntities } from './entities/BodyParamEntities';
import { UsageLogEntities } from './entities/UsageLogEntities';
import { SubscriptionEntities } from './entities/SubscriptionEntities';
import { PlanEntities } from './entities/PlanEntities';
import { CrossObjectEntities } from './entities/CrossObjectEntities';
import { ObjectPlanEntities } from './entities/ObjectPlanEntities';
import { EndpointObjectEntities } from './entities/EndpointObjectEntities';
import { ApiDocsEntities } from './entities/ApiDocsEntities';
import { ApiRatingEntities } from './entities/ApiRatingEntities';
import { ApiVersionEntities } from './entities/ApiVersionEntities';
import { ApiKeyEntities } from './entities/ApiKeyEntities';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiEntities,
      CategoryEntities,
      ApiCollectionEntities,

      EndpointsEntities,
      EndpointsGroupEntities,
      EndpointsParameterEntities,
      HealthCheckEntities,
      HealthCheckResultEntities,
      BodyParamEntities,
      UsageLogEntities,
      SubscriptionEntities,
      PlanEntities,
      CrossObjectEntities,
      ObjectPlanEntities,
      EndpointObjectEntities,
      ApiDocsEntities,
      ApiRatingEntities,
      ApiVersionEntities,
      ApiKeyEntities,
    ]),
  ],
  controllers: [ApisStatsController],
  providers: [ApisStatsService],
})
export class ApisStatsModule {}
