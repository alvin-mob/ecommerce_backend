import { NextFunction, Request, Response, Router } from "express";
import authRoutes from "./auth";
import sortRoutes from "./sortRoutes";
import productRoutes from "./productRoutes";
import userRoutes from "./userRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";



const rootRouter:Router = Router();


rootRouter.use('/auth', authRoutes);
rootRouter.use('/sort', sortRoutes)
rootRouter.use('/products', productRoutes)
rootRouter.use('/users', userRoutes)
rootRouter.use('/carts', cartRoutes)
rootRouter.use('/orders', orderRoutes)


export default rootRouter;