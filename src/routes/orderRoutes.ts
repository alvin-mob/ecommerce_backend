import {Router} from 'express'


import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from '../controllers/orders'
import { authMiddleware } from '../middlewares/auth'
import { errorHandler } from '../errorHandler'


const orderRoutes:Router = Router()

orderRoutes.post('/',[authMiddleware], errorHandler(createOrder))
orderRoutes.get('/',[authMiddleware], errorHandler(listOrders))
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
orderRoutes.get('/:id',[authMiddleware], errorHandler(getOrderById))


export default orderRoutes