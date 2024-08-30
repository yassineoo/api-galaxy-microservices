"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const endpoints_stats_controller_1 = __importDefault(require("./endpoints-stats.controller"));
const router = express_1.default.Router();
router.post("/oauth", (req, res) => {
    res.send("oauth");
});
router.post("/", endpoints_stats_controller_1.default.get_endpoints_stats);
exports.default = router;
