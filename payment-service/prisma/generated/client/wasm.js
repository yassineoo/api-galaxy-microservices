
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.19.0
 * Query Engine version: 5fe21811a6ba0b952a3bc71400666511fe3b902f
 */
Prisma.prismaVersion = {
  client: "5.19.0",
  engine: "5fe21811a6ba0b952a3bc71400666511fe3b902f"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Api_collection_entitiesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.Api_collections_apisScalarFieldEnum = {
  api_entity_id: 'api_entity_id',
  api_collection_entity_id: 'api_collection_entity_id'
};

exports.Prisma.Api_docs_entitiesScalarFieldEnum = {
  id: 'id',
  api_id: 'api_id',
  content: 'content',
  last_updated: 'last_updated'
};

exports.Prisma.Api_entitiesScalarFieldEnum = {
  id: 'id',
  provider_id: 'provider_id',
  name: 'name',
  image_path: 'image_path',
  description: 'description',
  category_id: 'category_id',
  status: 'status',
  date_created: 'date_created',
  last_updated: 'last_updated',
  date_deleted: 'date_deleted',
  keywords: 'keywords',
  api_url: 'api_url',
  visibility: 'visibility'
};

exports.Prisma.Api_key_entitiesScalarFieldEnum = {
  id: 'id',
  subscription_id: 'subscription_id',
  api_key: 'api_key',
  creation_date: 'creation_date',
  is_active: 'is_active'
};

exports.Prisma.Api_rating_entitiesScalarFieldEnum = {
  id: 'id',
  api_id: 'api_id',
  user_id: 'user_id',
  rating: 'rating',
  comment: 'comment',
  date_rated: 'date_rated'
};

exports.Prisma.Api_version_entitiesScalarFieldEnum = {
  id: 'id',
  api_id: 'api_id',
  version_number: 'version_number',
  release_date: 'release_date',
  whats_new: 'whats_new'
};

exports.Prisma.Body_param_entitiesScalarFieldEnum = {
  id: 'id',
  endpoint_id: 'endpoint_id',
  content_type: 'content_type',
  text_body: 'text_body',
  media_file_id: 'media_file_id'
};

exports.Prisma.Category_entitiesScalarFieldEnum = {
  id: 'id',
  category_name: 'category_name',
  description: 'description'
};

exports.Prisma.Cross_object_entitiesScalarFieldEnum = {
  id: 'id',
  object_id: 'object_id',
  limit_fee: 'limit_fee',
  limit_type: 'limit_type',
  price: 'price',
  quota_type: 'quota_type',
  quota_value: 'quota_value',
  add: 'add'
};

exports.Prisma.Endpoint_object_entitiesScalarFieldEnum = {
  id: 'id',
  object_id: 'object_id',
  endpoints_id: 'endpoints_id'
};

exports.Prisma.Endpoints_entitiesScalarFieldEnum = {
  id: 'id',
  group_id: 'group_id',
  methode: 'methode',
  url: 'url',
  description: 'description',
  name: 'name'
};

exports.Prisma.Endpoints_group_entitiesScalarFieldEnum = {
  id: 'id',
  group: 'group',
  api_id: 'api_id',
  description: 'description'
};

exports.Prisma.Endpoints_parameter_entitiesScalarFieldEnum = {
  id: 'id',
  endpoint_id: 'endpoint_id',
  key: 'key',
  value_type: 'value_type',
  parameter_type: 'parameter_type',
  example_value: 'example_value',
  required: 'required'
};

exports.Prisma.Health_check_entitiesScalarFieldEnum = {
  id: 'id',
  api_id: 'api_id',
  url: 'url',
  schedule: 'schedule',
  last_status: 'last_status',
  last_checked_at: 'last_checked_at',
  alerts_enabled: 'alerts_enabled'
};

exports.Prisma.Health_check_result_entitiesScalarFieldEnum = {
  id: 'id',
  health_check_id: 'health_check_id',
  status: 'status',
  response_time: 'response_time',
  status_message: 'status_message',
  checked_at: 'checked_at'
};

exports.Prisma.Object_plan_entitiesScalarFieldEnum = {
  id: 'id',
  api_id: 'api_id',
  name: 'name',
  description: 'description',
  all_endpoints: 'all_endpoints'
};

exports.Prisma.Plan_entitiesScalarFieldEnum = {
  id: 'id',
  api_id: 'api_id',
  name: 'name',
  active: 'active',
  visibility: 'visibility',
  type: 'type',
  rate: 'rate',
  rate_unite: 'rate_unite',
  recomnded_plan: 'recomnded_plan',
  price: 'price'
};

exports.Prisma.Subscription_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  api_id: 'api_id',
  plan_id: 'plan_id',
  start_date: 'start_date',
  end_date: 'end_date',
  status: 'status'
};

exports.Prisma.Usage_log_entitiesScalarFieldEnum = {
  id: 'id',
  subscription_id: 'subscription_id',
  timestamp: 'timestamp',
  endpoint_id: 'endpoint_id',
  status: 'status',
  response_time: 'response_time'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  api_collection_entities: 'api_collection_entities',
  api_collections_apis: 'api_collections_apis',
  api_docs_entities: 'api_docs_entities',
  api_entities: 'api_entities',
  api_key_entities: 'api_key_entities',
  api_rating_entities: 'api_rating_entities',
  api_version_entities: 'api_version_entities',
  body_param_entities: 'body_param_entities',
  category_entities: 'category_entities',
  cross_object_entities: 'cross_object_entities',
  endpoint_object_entities: 'endpoint_object_entities',
  endpoints_entities: 'endpoints_entities',
  endpoints_group_entities: 'endpoints_group_entities',
  endpoints_parameter_entities: 'endpoints_parameter_entities',
  health_check_entities: 'health_check_entities',
  health_check_result_entities: 'health_check_result_entities',
  object_plan_entities: 'object_plan_entities',
  plan_entities: 'plan_entities',
  subscription_entities: 'subscription_entities',
  usage_log_entities: 'usage_log_entities'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
