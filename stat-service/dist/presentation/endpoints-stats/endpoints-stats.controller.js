"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const try_catch_helper_1 = __importDefault(require("../../infrastructure/api/try-catch.helper"));
const dotenv_1 = require("dotenv");
const get_endpoints_error_calls_request_1 = __importDefault(require("../../contracts/endpoint-stats/get-endpoints-error-calls/get-endpoints-error-calls.request"));
const get_endpoints_stats_service_1 = require("../../application/services/endpoints-stats/get-endpoints-stats/get_endpoints_stats.service");
(0, dotenv_1.config)();
async function get_endpoints_stats(req, res) {
    return await (0, try_catch_helper_1.default)(res, async () => {
        const { duration } = get_endpoints_error_calls_request_1.default.query.parse(req.query);
        const { endpoint_ids } = get_endpoints_error_calls_request_1.default.body.parse(req.body);
        console.log({ duration });
        const results = await (0, get_endpoints_stats_service_1.get_stats)(duration, endpoint_ids);
        return res.status(200).send(results);
    });
}
exports.default = { get_endpoints_stats };
