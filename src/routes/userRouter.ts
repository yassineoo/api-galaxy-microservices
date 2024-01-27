import express from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/UAMController";
import userPermissionRouter from "./UPermissionRouter";
import { verifyAuthWithId, verifyRole } from "../controllers/permissionController";


const userRouter = express.Router();


//get user by id
userRouter.get("/:id", getUserById);

//get all users
userRouter.get("/", verifyRole(["admin"]), getAllUsers);

//update user
userRouter.put("/:id",verifyAuthWithId, verifyRole(['admin']) ,updateUser);

//delete user
userRouter.delete("/:id", verifyRole(["admin"]), deleteUser);

userRouter.use("permissions", userPermissionRouter);

export default userRouter;