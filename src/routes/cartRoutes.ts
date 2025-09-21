import { Router } from "express";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cartController";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../errorHandler";

const cartRoutes: Router = Router();


cartRoutes.get('/',[authMiddleware], errorHandler(getCart))
cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity))


export default cartRoutes