import express from "express";
import { addProfileByUserId, deleteAllUserProfiles, deleteProfileById, getAllProfiles, getProfileById, getProfilesByUserId, updateProfileById } from "../controllers/UPMController";

const profileRouter = express.Router();

//get all profiles
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get all profiles
 *     responses:
 *       200:
 *         description: OK
 */
profileRouter.get("/", getAllProfiles);

//get profile by id
/**
 * @swagger
 * /profile/{id}:
 *   get:
 *     summary: Get a profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
profileRouter.get("/:id", getProfileById);

//update profile by id
/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Update a profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
profileRouter.put("/:id", updateProfileById);

//delete profile by id
/**
 * @swagger
 * /profile/{id}:
 *   delete:
 *     summary: Delete a profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
profileRouter.delete("/:id", deleteProfileById);

//get profiles by user id
/**
 * @swagger
 * /profile/user/{id}:
 *   get:
 *     summary: Get profiles by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
profileRouter.get("/user/:id", getProfilesByUserId);

//add profile by user id
/**
 * @swagger
 * /profile/user:
 *   post:
 *     summary: Add a profile by user ID
 *     responses:
 *       200:
 *         description: OK
 */
profileRouter.post("/user", addProfileByUserId);

//delete all profiles of a user by ID
/**
 * @swagger
 * /profile/user/{id}:
 *   delete:
 *     summary: Delete all profiles of a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
profileRouter.delete("/user/:id", deleteAllUserProfiles);

export default profileRouter;
