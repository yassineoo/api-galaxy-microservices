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
exports.followUser = exports.deleteUser = exports.updateUserRole = exports.updateUser = exports.getAllUsers = exports.getUserById = void 0;
const http_1 = require("../utils/http");
const UAMService_1 = __importDefault(require("../services/UAMService"));
const UAMValidator_1 = __importDefault(require("../validators/UAMValidator"));
const follows_1 = __importDefault(require("../models/follows"));
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("User not found");
        return;
    }
    try {
        const user = yield UAMService_1.default.getUserById(parseInt(req.params.id));
        res.status(http_1.statusCodes.ok).send(user);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.getUserById = getUserById;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UAMService_1.default.getAllUsers();
        res.status(http_1.statusCodes.ok).send(users);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.getAllUsers = getAllUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = UAMValidator_1.default.updateSchema.validate(req.body);
    if (error) {
        res.status(http_1.statusCodes.badRequest).send(error.details[0].message);
        return;
    }
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("User not found");
        return;
    }
    try {
        const user = yield UAMService_1.default.updateUser(parseInt(req.params.id), req.body);
        res.status(http_1.statusCodes.ok).send(user);
        return;
    }
    catch (error) {
        return res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.updateUser = updateUser;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = UAMValidator_1.default.updateRoleSchema.validate(req.body);
    if (error) {
        res.status(http_1.statusCodes.badRequest).send(error.details[0].message);
        return;
    }
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("User not found");
        return;
    }
    try {
        const user = yield UAMService_1.default.updateRole(parseInt(req.params.id), req.body.role);
        res.status(http_1.statusCodes.ok).send(user);
        return;
    }
    catch (error) {
        return res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.updateUserRole = updateUserRole;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("User not found");
        return;
    }
    try {
        yield UAMService_1.default.deleteUser(parseInt(req.params.id));
        res.status(http_1.statusCodes.ok).send("User deleted successfully");
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.deleteUser = deleteUser;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield follows_1.default.followUser({
            userId: req.userId,
            followingId: parseInt(req.body.followingId),
        });
        res.status(http_1.statusCodes.ok).send("User followed successfully");
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.followUser = followUser;
