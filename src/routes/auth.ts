import { Router } from "express";
import { login, me, signUp } from "../controllers/authController";
import { errorHandler } from "../errorHandler";
import { authMiddleware } from "../middlewares/auth";

const authRoutes : Router = Router();

authRoutes.post('/login', errorHandler(login));
authRoutes.post('/signup', errorHandler(signUp));
authRoutes.get('/me', [authMiddleware], errorHandler(me) )

export default authRoutes;