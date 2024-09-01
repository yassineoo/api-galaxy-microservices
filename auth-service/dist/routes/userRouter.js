"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UAMController_1 = require("../controllers/UAMController");
const UPermissionRouter_1 = __importDefault(require("./UPermissionRouter"));
const permissionController_1 = require("../controllers/permissionController");
const userRouter = express_1.default.Router();
//get user by id
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: The user ID
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.get("/:id", UAMController_1.getUserById);
//get all users
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '500':
 *         description: Internal server error
 */
userRouter.get("/", (0, permissionController_1.verifyRole)(["admin"]), UAMController_1.getAllUsers);
//update user
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: The user ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.put("/:id", permissionController_1.verifyAuthWithId, (0, permissionController_1.verifyRole)(['admin']), UAMController_1.updateUser);
//updateUserRole
/**
 * @swagger
 * /user/role/{id}:
 *   put:
 *     summary: Update user role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: The user ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserRole'
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.put("/role/:id", (0, permissionController_1.verifyRole)(['admin']), UAMController_1.updateUserRole);
//delete user
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: The user ID
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.delete("/:id", (0, permissionController_1.verifyRole)(["admin"]), UAMController_1.deleteUser);
//follow user
/**
 * @swagger
 * /user/follow:
 *   post:
 *     summary: Follow a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followingId:
 *                 type: integer
 *                 description: The ID of the user to follow
 *             required:
 *               - followingId
 *     responses:
 *       '200':
 *         description: User followed successfully
 *       '500':
 *         description: Internal server error
 */
userRouter.post("/follow", permissionController_1.verifyAuth, UAMController_1.followUser);
userRouter.use("/permissions", UPermissionRouter_1.default);
exports.default = userRouter;
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *   UserRole:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       role:
 *         type: string
 */
