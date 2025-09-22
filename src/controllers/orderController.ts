import { Request, Response } from "express"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/notFoundException"
import { ErrorCode } from "../exceptions/root"


export const createOrder = async (req: Request, res: Response) => {
    //1. create a transcation
    //2. to list all the cart items and proceed if cart is not empty
    //3. calculate the total amount
    //4. fetch address of user
    //5. to define computed fiedl for formatted address on address module
    //6. create order and order products
    //7. create event related to that order
    return await prismaClient.$transaction(async(tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user?.id
            },
            include: {
                product: true
            }
        })
        if( cartItems.length == 0) {
            return res.json({message: "cart is empty"})
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0);
        const address = await tx.address.findFirst({
            where: {
                id: req.user?.defaultShippingAddressId!
            }
        })
        const order = await tx.order.create({
            data: {
                user :{
                    connect: {
                        id: req.user?.id
                    }
                },
                netAmount: price,
                address: address?.formattedAddress!,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })
    const orderEvent = await tx.orderEvent.create({
        data: {
            orderId: order.id,
        }
    })
    await tx.cartItem.deleteMany({
        where: {
            userId: req.user?.id
        }
    })
    return res.json(order)
    })
} 

export const listOrders = async(req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user?.id
        }
    })
    res.json(orders)

}

export const cancelOrder = async(req: Request, res: Response) => {


    // 1. wrap it inside tranaction
    // 2. check if the users is cancelling its own order

    return await prismaClient.$transaction( async (tx)=>{
        const existingOrder = await tx.order.findFirst({
            where: {
              id: +req.params.id,
              userId: req.user?.id, // ensures the order belongs to the logged-in user
            },
            select: { id: true, status: true },
          });

          if (!existingOrder) {
            throw new NotFoundException("Order not found or not yours", ErrorCode.ORDER_NOT_FOUND, null);
          }
          const order = await tx.order.update({
            where: { id: existingOrder.id },
            data: { status: "CANCELLED" },
          });
      
          await tx.orderEvent.create({
            data: {
              orderId: order.id,
              status: "CANCELLED",
            },
          });
          res.json(order);
    })
    

}

export const getOrderById = async(req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })
        res.json(order)
    } catch(err) {
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND, null)
    }

}

// export const listAllOrders = async(req: Request, res: Response) => {
//     let whereClause = {}
//     const status = req.query.status
//     if (status) {
//         whereClause = {
//             status
//         }
//     }
//     const orders = await prismaClient.order.findMany({
//         where: whereClause,
//         skip: +req.query.skip || 0,
//         take: 5
//     })
//     res.json(orders)
//}