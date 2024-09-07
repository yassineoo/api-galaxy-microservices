import express, { NextFunction, Request, Response } from "express";
import {
  Oauthlogin,
  getUserSession,
  login,
  resendVerificationEmail,
  signup,
  verifyEmail,
  resetPassword,
  activateTwoFactors,
  verifyOTP,
} from "../controllers/authController";
import { verifyAuth } from "../controllers/permissionController";
import { generateAuthToken } from "../utils/token";
import { ENV } from "../utils/env";

import { statusCodes } from "../utils/http";
import { prismaClientSingleton } from "../utils/prismaClient";

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
export enum Custom_Role {
  USER_CLIENT = "userClient",
  API_CLIENT = "APIClient"
}

authRouter.post("/login", login);
authRouter.post("/oauth", Oauthlogin);
authRouter.post("/session", getUserSession);
authRouter.post("/register", signup(Custom_Role.USER_CLIENT));
authRouter.post("/signup/api-client", signup(Custom_Role.API_CLIENT));

authRouter.get("/resend-email", verifyAuth, resendVerificationEmail);
authRouter.post("/verifyEmail/:token", verifyEmail);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.patch("/resetPassword", verifyAuth, resetPassword);

authRouter.put("/activate-two-factors/:userId", activateTwoFactors);
authRouter.post("/verifyOTP", verifyOTP);

authRouter.get(
  "/api-collections",
  async (req: Request, res: Response, next: NextFunction) => {
    const api_collections =
      await prismaClientSingleton.api_collection_entities.findMany({
        include: {
          api_collections_apis: {
            include: {
              api_entities: true,
            },
          },
        },
      });
    console.log({ api_collections });
    return res.status(statusCodes.ok).json(api_collections);
  }
);

authRouter.get(
  "/categories",
  async (req: Request, res: Response, next: NextFunction) => {
    const api_categories =
      await prismaClientSingleton.category_entities.findMany();
    console.log({ api_collections: api_categories });
    return res.status(statusCodes.ok).json(api_categories);
  }
);

authRouter.get("/hello", async (req: any, res: any) => {
  const token = await generateAuthToken(
    1,
    "jy_attou@esi.dz",
    ENV.JWT_SECRET,
    "1hr"
  );
  console.log({ token });
  return res.json({ token });
});

export default authRouter;
