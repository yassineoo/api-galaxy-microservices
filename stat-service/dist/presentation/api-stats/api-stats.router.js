"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_stats_controller_1 = __importDefault(require("./api-stats.controller"));
const authenticate_middleware_1 = __importDefault(require("../_common/middlewares/authenticate.middleware"));
const router = express_1.default.Router();
router.use(authenticate_middleware_1.default);
router.post("/", api_stats_controller_1.default.get_apis_stats);
exports.default = router;
