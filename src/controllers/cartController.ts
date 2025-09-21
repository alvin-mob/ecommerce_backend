import { Request, Response } from "express";
import { changeQuantitySchema, createCartSchema } from "../schema/cart";
import { prismaClient } from "..";
import { CartItem, Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/notFoundException";
import { ErrorCode } from "../exceptions/root";


export const addItemToCart = async (req: Request, res: Response) => {
    // validate the request body
  const validatedData = createCartSchema.parse(req.body)
  let product: Product; 
  // check whether the product is available
  try{
    product = await prismaClient.product.findFirstOrThrow({
       where:{
        id: validatedData.productId
       }
    })
   }catch(error){
    throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND, null);
   } 
   const cart = await prismaClient.cartItem.create({
    data :{
        userId : req.user?.id!,
        productId : validatedData.productId,
        quantity : validatedData.quantity
    }
})
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    //check user is deleting its own cart item
    try{
        const cartItem = await prismaClient.cartItem.findFirstOrThrow({
            where:{
                id: +req.params.id,
                userId: req.user?.id
            }
        })
    }catch(err){
        throw new NotFoundException("Cart item not found", ErrorCode.CART_ITEM_NOT_FOUND, null);
    }
    await prismaClient.cartItem.delete({
        where: {
            id: +req.params.id
        }
    })
    res.json('success');
}
export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = changeQuantitySchema.parse(req.body)
    // check if the user is updating its won cart item
    try{
        const cartItem = await prismaClient.cartItem.findFirstOrThrow({
            where:{
                id: +req.params.id,
                userId: req.user?.id
            }
        })
    }catch(err){
        throw new NotFoundException("Cart item not found", ErrorCode.CART_ITEM_NOT_FOUND, null);
    }
    
    const updatedCart = await prismaClient.cartItem.update({
        where:{
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })
    res.json(updatedCart)
}

export const getCart = async (req: Request, res: Response) => {
    const cartItems = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user?.id
        },
        include :{
            product : true
        }
    })
    res.json(cartItems)
}
