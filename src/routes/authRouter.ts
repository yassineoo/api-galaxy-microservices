import express from "express";
import { login, signup } from "../controllers/authController";

const authRouter = express.Router();


authRouter.post("/login", login);
authRouter.post("/signup/userClient", signup("userClient"));
authRouter.post("/signup/APIClient", signup("APIClient"));


export default authRouter; 
