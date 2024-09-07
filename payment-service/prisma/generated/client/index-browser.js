
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
 * Prisma Client JS version: 5.19.1
 * Query Engine version: 69d742ee20b815d88e17e54db4a2a7a3b30324e3
 */
Prisma.prismaVersion = {
  client: "5.19.1",
  engine: "69d742ee20b815d88e17e54db4a2a7a3b30324e3"
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
  description: 'description',
  image_path: 'image_path'
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
  visibility: 'visibility',
  rating: 'rating',
  stripe_product_id: 'stripe_product_id'
};

exports.Prisma.Api_key_entitiesScalarFieldEnum = {
  id: 'id',
  subscription_id: 'subscription_id',
  api_key: 'api_key',
  creation_date: 'creation_date',
  is_active: 'is_active',
  user_id: 'user_id',
  api_key_id: 'api_key_id'
};

exports.Prisma.Api_report_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  api_id: 'api_id',
  description: 'description',
  screenshots: 'screenshots'
};

exports.Prisma.Api_review_entitiesScalarFieldEnum = {
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

exports.Prisma.Billing_history_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  invoice_id: 'invoice_id',
  payment_date: 'payment_date',
  amount: 'amount'
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

exports.Prisma.Chatroom_entitiesScalarFieldEnum = {
  id: 'id'
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
  schedule: 'schedule',
  last_status: 'last_status',
  last_checked_at: 'last_checked_at',
  alerts_enabled: 'alerts_enabled',
  endpoint_id: 'endpoint_id',
  email: 'email'
};

exports.Prisma.Health_check_result_entitiesScalarFieldEnum = {
  id: 'id',
  health_check_id: 'health_check_id',
  status: 'status',
  response_time: 'response_time',
  status_message: 'status_message',
  checked_at: 'checked_at'
};

exports.Prisma.Invoice_entitiesScalarFieldEnum = {
  id: 'id',
  subscription_id: 'subscription_id',
  total_amount: 'total_amount',
  date_issued: 'date_issued',
  due_date: 'due_date',
  status: 'status',
  stripe_invoice_id: 'stripe_invoice_id'
};

exports.Prisma.Like_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  api_id: 'api_id'
};

exports.Prisma.Message_entitiesScalarFieldEnum = {
  id: 'id',
  chatroom_id: 'chatroom_id',
  user_id: 'user_id',
  message: 'message',
  created_at: 'created_at'
};

exports.Prisma.Moderator_permission_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  permission_id: 'permission_id'
};

exports.Prisma.Notification_entitiesScalarFieldEnum = {
  id: 'id',
  recipient_id: 'recipient_id',
  title: 'title',
  message: 'message',
  isRead: 'isRead'
};

exports.Prisma.Object_plan_entitiesScalarFieldEnum = {
  id: 'id',
  api_id: 'api_id',
  name: 'name',
  description: 'description',
  all_endpoints: 'all_endpoints'
};

exports.Prisma.Payment_method_entitiesScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  account_details: 'account_details',
  is_default: 'is_default',
  stripe_payment_method_id: 'stripe_payment_method_id'
};

exports.Prisma.Permission_entitiesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
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
  price: 'price',
  stripe_price_id: 'stripe_price_id'
};

exports.Prisma.Profile_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  full_name: 'full_name',
  bio: 'bio',
  profile_picture: 'profile_picture',
  date_of_birth: 'date_of_birth',
  location: 'location'
};

exports.Prisma.Review_reports_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  review_id: 'review_id',
  description: 'description',
  reason: 'reason'
};

exports.Prisma.Settings_entitiesScalarFieldEnum = {
  id: 'id',
  earning_percentage: 'earning_percentage',
  termsAndConditions: 'termsAndConditions',
  privacyAndPolicy: 'privacyAndPolicy',
  updated_at: 'updated_at',
  admin_id: 'admin_id'
};

exports.Prisma.Subscription_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  plan_id: 'plan_id',
  start_date: 'start_date',
  end_date: 'end_date',
  used_calls: 'used_calls',
  status: 'status',
  stripe_sub_id: 'stripe_sub_id'
};

exports.Prisma.Transaction_entitiesScalarFieldEnum = {
  id: 'id',
  invoice_id: 'invoice_id',
  amount: 'amount',
  transaction_date: 'transaction_date',
  payment_method_id: 'payment_method_id',
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

exports.Prisma.UserVerification_entitiesScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  otp: 'otp',
  expired: 'expired'
};

exports.Prisma.User_chatroom_entitiesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  chatroom_id: 'chatroom_id'
};

exports.Prisma.User_entitiesScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  password_hash: 'password_hash',
  date_created: 'date_created',
  last_login: 'last_login',
  is_active: 'is_active',
  is_two_factor: 'is_two_factor',
  role: 'role',
  phone_number: 'phone_number',
  verified: 'verified',
  image: 'image',
  stripe_customer_id: 'stripe_customer_id'
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
  api_report_entities: 'api_report_entities',
  api_review_entities: 'api_review_entities',
  api_version_entities: 'api_version_entities',
  billing_history_entities: 'billing_history_entities',
  body_param_entities: 'body_param_entities',
  category_entities: 'category_entities',
  chatroom_entities: 'chatroom_entities',
  cross_object_entities: 'cross_object_entities',
  endpoint_object_entities: 'endpoint_object_entities',
  endpoints_entities: 'endpoints_entities',
  endpoints_group_entities: 'endpoints_group_entities',
  endpoints_parameter_entities: 'endpoints_parameter_entities',
  health_check_entities: 'health_check_entities',
  health_check_result_entities: 'health_check_result_entities',
  invoice_entities: 'invoice_entities',
  like_entities: 'like_entities',
  message_entities: 'message_entities',
  moderator_permission_entities: 'moderator_permission_entities',
  notification_entities: 'notification_entities',
  object_plan_entities: 'object_plan_entities',
  payment_method_entities: 'payment_method_entities',
  permission_entities: 'permission_entities',
  plan_entities: 'plan_entities',
  profile_entities: 'profile_entities',
  review_reports_entities: 'review_reports_entities',
  settings_entities: 'settings_entities',
  subscription_entities: 'subscription_entities',
  transaction_entities: 'transaction_entities',
  usage_log_entities: 'usage_log_entities',
  userVerification_entities: 'userVerification_entities',
  user_chatroom_entities: 'user_chatroom_entities',
  user_entities: 'user_entities'
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