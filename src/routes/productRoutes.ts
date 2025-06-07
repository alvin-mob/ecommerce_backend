import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { createProduct, deleteProduct, getProductById, getProductList, updateProduct } from "../controllers/productController";
import adminMiddleware from "../middlewares/admin";
import { authMiddleware } from "../middlewares/auth";

const productRoutes : Router =  Router();

productRoutes.post('/',[authMiddleware,adminMiddleware], errorHandler(createProduct));
productRoutes.get('/', [authMiddleware], errorHandler(getProductList));
productRoutes.put('/:id', [authMiddleware], errorHandler(updateProduct));
productRoutes.delete('/:id', [authMiddleware], errorHandler(deleteProduct));
productRoutes.get('/:id', [authMiddleware], errorHandler(getProductById));


export default productRoutes;