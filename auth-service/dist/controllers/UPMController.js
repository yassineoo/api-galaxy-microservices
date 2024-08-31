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
exports.addProfileByUserId = exports.deleteAllUserProfiles = exports.getProfilesByUserId = exports.deleteProfileById = exports.updateProfileById = exports.getAllProfiles = exports.getProfileById = void 0;
const http_1 = require("../utils/http");
const UPMValidator_1 = __importDefault(require("../validators/UPMValidator"));
const UPMService_1 = __importDefault(require("../services/UPMService"));
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("Profile not found");
        return;
    }
    try {
        const profile = yield UPMService_1.default.getProfileById(parseInt(req.params.id));
        res.status(http_1.statusCodes.ok).send(profile);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.getProfileById = getProfileById;
const getAllProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield UPMService_1.default.getAllProfiles();
        res.status(http_1.statusCodes.ok).send(profiles);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.getAllProfiles = getAllProfiles;
const updateProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("Profile not found");
        return;
    }
    try {
        const profile = yield UPMService_1.default.updateProfileById(parseInt(req.params.id), req.body);
        res.status(http_1.statusCodes.ok).send(profile);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.updateProfileById = updateProfileById;
const deleteProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("Profile not found");
        return;
    }
    try {
        const profile = yield UPMService_1.default.deleteProfileById(parseInt(req.params.id));
        res.status(http_1.statusCodes.ok).send(profile);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.deleteProfileById = deleteProfileById;
const getProfilesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("Profile not found");
        return;
    }
    try {
        const profile = yield UPMService_1.default.getProfilesByUserId(parseInt(req.params.id));
        res.status(http_1.statusCodes.ok).send(profile);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.getProfilesByUserId = getProfilesByUserId;
const deleteAllUserProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params || req.params.id === undefined) {
        res.status(http_1.statusCodes.badRequest).send("Profile not found");
        return;
    }
    try {
        const profile = yield UPMService_1.default.deleteAllUserProfiles(parseInt(req.params.id));
        res.status(http_1.statusCodes.ok).send(profile);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.deleteAllUserProfiles = deleteAllUserProfiles;
const addProfileByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = UPMValidator_1.default.userProfileSchema.validate(req.body);
    if (error) {
        res.status(http_1.statusCodes.badRequest).send(error.details[0].message);
        return;
    }
    try {
        const profile = yield UPMService_1.default.addProfile(req.body);
        res.status(http_1.statusCodes.ok).send(profile);
    }
    catch (error) {
        res.status(http_1.statusCodes.serverError).send("Internal server error");
    }
});
exports.addProfileByUserId = addProfileByUserId;
