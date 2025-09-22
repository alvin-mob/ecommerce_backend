import {Router} from 'express'

import { authMiddleware } from '../middlewares/auth'
import { errorHandler } from '../errorHandler'
import { cancelOrder, createOrder, getOrderById, listOrders } from '../controllers/orderController'


const orderRoutes:Router = Router()

orderRoutes.post('/',[authMiddleware], errorHandler(createOrder))
orderRoutes.get('/',[authMiddleware], errorHandler(listOrders))
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
orderRoutes.get('/:id',[authMiddleware], errorHandler(getOrderById))


export default orderRoutes