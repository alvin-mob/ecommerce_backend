import { Router } from "express";
import authRoutes from "./auth";
import sortRoutes from "./sortRoutes";



const rootRouter:Router = Router();


rootRouter.use('/auth', authRoutes);
rootRouter.use('/sort', sortRoutes)


export default rootRouter;