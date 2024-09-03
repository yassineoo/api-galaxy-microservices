"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userPermissionRouter = express_1.default.Router();
userPermissionRouter.post("/addPermission/userId");
userPermissionRouter.delete("/removePermission/userId");
exports.default = userPermissionRouter;
