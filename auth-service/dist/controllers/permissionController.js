"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyModeratorPermissions = exports.verifyAuthWithId = exports.verifyAuth = exports.verifyRole = void 0;
const token_1 = require("../utils/token");
const http_1 = require("../utils/http");
const permissions_1 = require("../models/permissions");
const UAMService_1 = __importDefault(require("../services/UAMService"));
require("dotenv").config();
const tokenSecret = process.env.JWT_SECRET;
const verifyRole = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return res.status(http_1.statusCodes.unauthorized).send("No token provided");
            }
            const tokenData = (0, token_1.decodeAuthToken)(token, tokenSecret || "");
            if (typeof tokenData === "string") {
                return res.status(http_1.statusCodes.unauthorized).send(tokenData);
            }
            const userRole = yield UAMService_1.default.getUserRole(tokenData.userId);
            if (userRole === null) {
                return res.status(http_1.statusCodes.unauthorized).send("User role not found");
            }
            if (!allowedRoles.includes(userRole)) {
                return res
                    .status(http_1.statusCodes.forbidden)
                    .send("Insufficient permissions");
            }
            next();
        }
        catch (error) {
            res
                .status(401)
                .send(error instanceof Error ? error.message : "Authentication failed");
        }
    });
};
exports.verifyRole = verifyRole;
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(http_1.statusCodes.unauthorized).send("No token provided");
        }
        const tokenData = (0, token_1.decodeAuthToken)(token, tokenSecret || "");
        if (typeof tokenData === "string") {
            return res.status(http_1.statusCodes.unauthorized).send(tokenData);
        }
        req.userId = tokenData.userId;
        next();
    }
    catch (error) {
        res
            .status(401)
            .send(error instanceof Error ? error.message : "Authentication failed");
    }
});
exports.verifyAuth = verifyAuth;
const verifyAuthWithId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        if (!token) {
            return res.status(http_1.statusCodes.unauthorized).send("No token provided");
        }
        const tokenData = (0, token_1.decodeAuthToken)(token, tokenSecret || "");
        if (typeof tokenData === "string") {
            return res.status(http_1.statusCodes.unauthorized).send(tokenData);
        }
        const id = tokenData.userId;
        if (!id) {
            return res.status(http_1.statusCodes.unauthorized).send("User not found");
        }
        const user = yield UAMService_1.default.getUserById(id);
        if ((user === null || user === void 0 ? void 0 : user.role) === "userClient" || (user === null || user === void 0 ? void 0 : user.role) === "APIClient") {
            if (id !== parseInt(req.params.id)) {
                return res
                    .status(http_1.statusCodes.forbidden)
                    .send("Insufficient permissions");
            }
        }
        next();
    }
    catch (error) {
        res
            .status(401)
            .send(error instanceof Error ? error.message : "Authentication failed");
    }
});
exports.verifyAuthWithId = verifyAuthWithId;
const verifyModeratorPermissions = (req, res, next, permissions) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
        if (!token) {
            return res.status(http_1.statusCodes.unauthorized).send("No token provided");
        }
        const tokenData = (0, token_1.decodeAuthToken)(token, tokenSecret || "");
        if (typeof tokenData === "string") {
            return res.status(http_1.statusCodes.unauthorized).send(tokenData);
        }
        const userPermissions = yield (0, permissions_1.getPermissions)(tokenData.userId);
        if (!userPermissions) {
            return res.status(http_1.statusCodes.forbidden).send("Insufficient permissions");
        }
        const hasPermission = userPermissions.some((permission) => permissions.includes(permission.Name));
        if (!hasPermission) {
            return res.status(http_1.statusCodes.forbidden).send("Insufficient permissions");
        }
        next();
    }
    catch (error) {
        res
            .status(401)
            .send(error instanceof Error ? error.message : "Authentication failed");
    }
});
exports.verifyModeratorPermissions = verifyModeratorPermissions;
