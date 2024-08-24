"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const _common_1 = require("../_common");
const getEndpointsSuccessCallsQueryValidator = zod_1.z.object({
    duration: _common_1.durationValidator
});
const getEndpointsSuccessCallsBodyValidator = zod_1.z.object({
    endpoint_ids: zod_1.z.array(_common_1.idValidator)
});
const getEndpointsSuccessCallsValidator = {
    body: getEndpointsSuccessCallsBodyValidator,
    query: getEndpointsSuccessCallsQueryValidator
};
exports.default = getEndpointsSuccessCallsValidator;
