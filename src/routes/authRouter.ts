import express from "express";
import { login, resendVerificationEmail, signup, verifyEmail } from "../controllers/authController";
import { verifyAuth } from "../controllers/permissionController";

const authRouter = express.Router();

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
authRouter.post("/login", login);
authRouter.post("/signup/user-client", signup("userClient"));
authRouter.post("/signup/api-client", signup("APIClient"));

authRouter.get("/resend-email",verifyAuth, resendVerificationEmail);
authRouter.get("/verify-email/:token",verifyAuth, verifyEmail);


export default authRouter;
