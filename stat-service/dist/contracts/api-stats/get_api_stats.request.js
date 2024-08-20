"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_api_stats_query_validator = exports.get_api_stats_body_validator = void 0;
const zod_1 = require("zod");
const _common_1 = require("../endpoint-stats/_common");
exports.get_api_stats_body_validator = zod_1.z.object({
    api_ids: zod_1.z.array(_common_1.idValidator).nonempty("api_ids cannot be empty")
});
exports.get_api_stats_query_validator = zod_1.z.object({
    duration: _common_1.durationValidator
});
