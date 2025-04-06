import { Router } from "express";
import { login, signUp } from "../controllers/authController";
import { errorHandler } from "../errorHandler";

const authRoutes : Router = Router();

authRoutes.post('/login', errorHandler(login));
authRoutes.post('/signup', errorHandler(signUp));

export default authRoutes;