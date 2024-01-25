import express from "express";
import { deleteUser } from "../controllers/UAMController";
import userPermissionRouter from "./UPermissionRouter";


const userRouter = express.Router();


//create user
userRouter.post("/", );

//get user by id
userRouter.get("/:id", );

//get all users
userRouter.get("/", );

//update user
userRouter.put("/:id", );

//delete user
userRouter.delete(":id", deleteUser);

userRouter.use("permissions",userPermissionRouter);

export default userRouter;