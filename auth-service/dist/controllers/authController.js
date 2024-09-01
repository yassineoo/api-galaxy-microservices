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
exports.resetPassword = exports.verifyEmail = exports.resendVerificationEmail = exports.getUserSession = exports.Oauthlogin = exports.login = exports.signup = void 0;
const http_1 = require("../utils/http");
const authService_1 = __importDefault(require("../services/authService"));
require("dotenv").config();
const signup = (role) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tokenData = yield authService_1.default.register(req.body, role);
            console.log({ tokenData });
            return res.status(http_1.statusCodes.ok).json({ id: Number(tokenData.id), message: tokenData.message });
        }
        catch (error) {
            console.log({ error });
            const { message, statusCode = http_1.statusCodes.badRequest } = error;
            // HADI MCHFTHACH MAIS M3LICH 500 IS ENOUGH
            return res.status(500).json({ message });
        }
    });
};
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield authService_1.default.login(req.body);
        if (!token.message) {
            return res.status(http_1.statusCodes.ok).send(Object.assign({}, token));
        }
        else {
            return res.json({ message: token === null || token === void 0 ? void 0 : token.message });
        }
    }
    catch (error) {
        res.status(http_1.statusCodes.badRequest).send({ error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.login = login;
const Oauthlogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("called from backend");
        const token = yield authService_1.default.OathUser(req.body);
        console.log("token", token);
        return res.status(http_1.statusCodes.ok).json(Object.assign({}, token));
    }
    catch (error) {
        res.status(http_1.statusCodes.badRequest).send({ message: error.message });
    }
});
exports.Oauthlogin = Oauthlogin;
//get user session
const getUserSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield authService_1.default.getSession(req.body);
        res.status(http_1.statusCodes.ok).send(Object.assign({}, token));
    }
    catch (error) {
        res.status(http_1.statusCodes.badRequest).send({ error: error.message });
    }
});
exports.getUserSession = getUserSession;
//requires being logged in
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userId == null) {
            throw new Error("User not found");
        }
        authService_1.default.resendVerificationEmail(req.userId);
        res.status(http_1.statusCodes.ok).send("Email sent");
    }
    catch (error) {
        res.status(http_1.statusCodes.badRequest).send({ error: error.message });
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
//requires a token to be sent in the link and being logged in
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = (_a = req.params.token) !== null && _a !== void 0 ? _a : req.body;
        const isEmailProvided = !Boolean(req.params.token);
        const result = (yield authService_1.default.verifyEmail(data, isEmailProvided));
        if (!(result === null || result === void 0 ? void 0 : result.message)) {
            res.status(http_1.statusCodes.ok).send(true);
        }
        else {
            res.send(false);
        }
    }
    catch (error) {
        res.status(http_1.statusCodes.badRequest).send({ error: error.message });
    }
});
exports.verifyEmail = verifyEmail;
//reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const result = (yield authService_1.default.resetUserPassword(req.body, userId));
        console.log(result);
        if (!result.message) {
            res.json({
                message: result === null || result === void 0 ? void 0 : result.message,
            });
        }
        else {
            res.status(http_1.statusCodes.ok).send(true);
        }
    }
    catch (error) {
        res.status(http_1.statusCodes.badRequest).json({
            message: error.message,
        });
    }
});
exports.resetPassword = resetPassword;
