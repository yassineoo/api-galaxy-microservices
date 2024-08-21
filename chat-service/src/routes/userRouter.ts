import express from "express";
import { deleteUser, followUser, getAllUsers, getUserById, updateUser, updateUserRole } from "../controllers/UAMController";
import userPermissionRouter from "./UPermissionRouter";
import { verifyAuth, verifyAuthWithId, verifyRole } from "../controllers/permissionController";


const userRouter = express.Router();


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
userRouter.get("/:id", getUserById);

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
userRouter.get("/", verifyRole(["admin"]), getAllUsers);

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
userRouter.put("/:id", verifyAuthWithId, verifyRole(['admin']), updateUser);

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
userRouter.put("/role/:id", verifyRole(['admin']), updateUserRole);

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
userRouter.delete("/:id", verifyRole(["admin"]), deleteUser);

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
userRouter.post("/follow", verifyAuth, followUser);

userRouter.use("/permissions", userPermissionRouter);


export default userRouter;

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
