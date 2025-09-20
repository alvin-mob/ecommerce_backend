import { NextFunction, Request, Response, Router } from "express";
import authRoutes from "./auth";
import sortRoutes from "./sortRoutes";
import productRoutes from "./productRoutes";
import userRoutes from "./userRoutes";



const rootRouter:Router = Router();


rootRouter.use('/auth', authRoutes);
rootRouter.use('/sort', sortRoutes)
rootRouter.use('/products', productRoutes)
rootRouter.use('/users', userRoutes)


export default rootRouter;