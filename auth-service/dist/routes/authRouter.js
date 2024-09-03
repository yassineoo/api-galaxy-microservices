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
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const permissionController_1 = require("../controllers/permissionController");
const token_1 = require("../utils/token");
const env_1 = require("../utils/env");
const http_1 = require("../utils/http");
const prismaClient_1 = require("../utils/prismaClient");
const authRouter = express_1.default.Router();
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     parameters:
 *       - in: body
 *         name: Email
 *         description: User's email
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: password
 *         description: User's password
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 * /signup/user-client:
 *   post:
 *     summary: User client signup
 *     parameters:
 *       - in: body
 *         name: username
 *         description: User's username
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: fullName
 *         description: User's full name
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: dateOfBirth
 *         description: User's date of birth
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: body
 *         name: email
 *         description: User's email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *       - in: body
 *         name: password
 *         description: User's password
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 * /signup/api-client:
 *   post:
 *     summary: API client signup
 *     parameters:
 *       - in: body
 *         name: username
 *         description: User's username
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: fullName
 *         description: User's full name
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: dateOfBirth
 *         description: User's date of birth
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: body
 *         name: email
 *         description: User's email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *       - in: body
 *         name: password
 *         description: User's password
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
authRouter.post("/login", authController_1.login);
authRouter.post("/oauth", authController_1.Oauthlogin);
authRouter.post("/session", authController_1.getUserSession);
authRouter.post("/register", (0, authController_1.signup)("userClient"));
authRouter.post("/signup/api-client", (0, authController_1.signup)("APIClient"));
authRouter.get("/resend-email", permissionController_1.verifyAuth, authController_1.resendVerificationEmail);
authRouter.post("/verifyEmail/:token", authController_1.verifyEmail);
authRouter.post("/verifyEmail", authController_1.verifyEmail);
authRouter.patch("/resetPassword", permissionController_1.verifyAuth, authController_1.resetPassword);
authRouter.put("/activate-two-factors/:userId", authController_1.activateTwoFactors);
authRouter.post("/verifyOTP", authController_1.verifyOTP);
authRouter.get("/api-collections", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const api_collections = yield prismaClient_1.prismaClientSingleton.api_collection_entities.findMany({
        include: {
            api_collections_apis: {
                include: {
                    api_entities: true,
                },
            },
        },
    });
    console.log({ api_collections });
    return res.status(http_1.statusCodes.ok).json(api_collections);
}));
authRouter.get("/categories", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const api_categories = yield prismaClient_1.prismaClientSingleton.category_entities.findMany();
    console.log({ api_collections: api_categories });
    return res.status(http_1.statusCodes.ok).json(api_categories);
}));
authRouter.get("/hello", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, token_1.generateAuthToken)(1, "jy_attou@esi.dz", env_1.ENV.JWT_SECRET, "1hr");
    console.log({ token });
    return res.json({ token });
}));
exports.default = authRouter;
