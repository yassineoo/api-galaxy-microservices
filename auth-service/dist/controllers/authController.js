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
exports.verifyOTP = exports.activateTwoFactors = exports.resetPassword = exports.verifyEmail = exports.resendVerificationEmail = exports.getUserSession = exports.Oauthlogin = exports.login = exports.signup = void 0;
const http_1 = require("../utils/http");
const authService_1 = __importDefault(require("../services/authService"));
const UAuthValidator_1 = require("../validators/UAuthValidator");
const zod_validation_1 = __importDefault(require("../utils/zod.validation"));
require("dotenv").config();
// connect producer
//connectProducer()
const signup = (role) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validation = UAuthValidator_1.signupValidator.safeParse(req.body);
            if (!validation.success) {
                console.log({ validation_error: validation.error });
                return res
                    .status(http_1.statusCodes.badRequest)
                    .json({ errors: (0, zod_validation_1.default)(validation.error) });
            }
            const tokenData = yield authService_1.default.register(validation.data, role);
            console.log({ tokenData });
            return res.status(http_1.statusCodes.ok).json({
                id: Number(tokenData.id),
                message: tokenData.message,
            });
        }
        catch (error) {
            console.log({ error });
            const { message } = error;
            // HADI MCHFTHACH MAIS M3LICH 500 IS ENOUGH
            return res.status(http_1.statusCodes.badRequest).json({ message });
        }
    });
};
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = UAuthValidator_1.loginValidator.safeParse(req.body);
        if (!validation.success) {
            return res
                .status(http_1.statusCodes.badRequest)
                .json({ errors: (0, zod_validation_1.default)(validation.error) });
        }
        const token = yield authService_1.default.login(req.body);
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log(token);
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        console.log("----------------------------------");
        return res
            .status(http_1.statusCodes.ok)
            .send(Object.assign(Object.assign({}, token), { userId: Number(token.userId), token: token.token }));
    }
    catch (error) {
        return res.status(http_1.statusCodes.badRequest).send({ error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.login = login;
const Oauthlogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("called from backend");
        const token = yield authService_1.default.OathUser(req.body);
        //console.log("token", token);
        console.log({ token });
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
const activateTwoFactors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            throw Error("invalid userId");
        }
        yield authService_1.default.activateTwoFactors(userId);
        return res.status(200).send(true);
    }
    catch (error) {
        next(error);
    }
});
exports.activateTwoFactors = activateTwoFactors;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, userId } = req.body;
        yield authService_1.default.verifyOTP(userId, otp);
        res.status(200).send(true);
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOTP = verifyOTP;
