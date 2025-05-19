import { NextFunction, Request, Response, Router } from "express";
import authRoutes from "./auth";
import sortRoutes from "./sortRoutes";
import productRoutes from "./productRoutes";



const rootRouter:Router = Router();


rootRouter.use('/auth', authRoutes);
rootRouter.use('/sort', sortRoutes)
rootRouter.use('/products', productRoutes)
rootRouter.use('/pro',(req:Request, res: Response, next:NextFunction)=>{
    res.send("pro route working");
})


export default rootRouter;