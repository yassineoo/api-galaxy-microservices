"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UPMController_1 = require("../controllers/UPMController");
const profileRouter = express_1.default.Router();
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
profileRouter.get("/", UPMController_1.getAllProfiles);
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
profileRouter.get("/:id", UPMController_1.getProfileById);
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
profileRouter.put("/:id", UPMController_1.updateProfileById);
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
profileRouter.delete("/:id", UPMController_1.deleteProfileById);
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
profileRouter.get("/user/:id", UPMController_1.getProfilesByUserId);
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
profileRouter.post("/user", UPMController_1.addProfileByUserId);
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
profileRouter.delete("/user/:id", UPMController_1.deleteAllUserProfiles);
exports.default = profileRouter;
