"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const try_catch_helper_1 = __importDefault(require("../../infrastructure/api/try-catch.helper"));
const get_api_stats_request_1 = require("../../contracts/api-stats/get_api_stats.request");
const get_api_stats_service_1 = __importDefault(require("../../application/services/api-stats/get_api_stats/get_api_stats.service"));
async function get_apis_stats(req, res) {
    return await (0, try_catch_helper_1.default)(res, async () => {
        const { api_ids } = get_api_stats_request_1.get_api_stats_body_validator.parse(req.body);
        const { duration } = get_api_stats_request_1.get_api_stats_query_validator.parse(req.query);
        console.log({ duration });
        const results = await (0, get_api_stats_service_1.default)(api_ids, duration);
        return res.json(results).status(200);
    });
}
exports.default = { get_apis_stats };
