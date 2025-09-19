import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../errorHandler";
import { addAddress, deleteAddress, getAddresses, updateAddress, updateUser } from "../controllers/userController";

const userRoutes : Router =  Router();

userRoutes.post('/address',[authMiddleware], errorHandler(addAddress));
userRoutes.get('/address', [authMiddleware], errorHandler(getAddresses));
userRoutes.put('/address/:id', [authMiddleware], errorHandler(updateAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.put('/',[authMiddleware], errorHandler(updateUser));

export default userRoutes;