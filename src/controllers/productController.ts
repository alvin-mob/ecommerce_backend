import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFoundException";
import { productSchema } from "../schema/products";
import { UnprocessabilityException } from "../exceptions/validations";
import { ZodError } from "zod";
import { ErrorCode } from "../exceptions/root";

//get product by id

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const product = prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product);
    }catch(err){
        throw new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND, null);
    }
 
}

// get list of products

export const getProductList = async (req: Request, res: Response, next: NextFunction) => {

    // response structure
    // { count : int, data: []}
    const count = await prismaClient.product.count()
    const queryParams: {skip?:number, take?: number} = req.params.skip ? {skip : +req.params.skip, take: 5} : {};
    const products = await prismaClient.product.findMany(
       queryParams
    )
    console.log(`count ===> ${count}`);
    res.json({
        count,
        data: products
    });
}

// create product



export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  
    productSchema.parse(req.body);
    const product = await prismaClient.product.create({
        data: {
          ...req.body,
          tags: req.body.tags.join(',')  
        }
        // data :{
        //     name: "Tea",
        // description: "A sweet tea",
        // tags: "Tea,India",
        // price: 120.0
        // }
    })
    res.json(product);
}


// update product

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const product = req.body;
        if(product.tags){
            product.tags = product.tags.join(',')
        }
        const updatedProduct = await prismaClient.product.update({
            where:{
                id: +req.params.id
            },
            data : product
        })
        res.json(updatedProduct);
    }catch(err){
        throw new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND, null)
    }

}
// delete product

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const product = await prismaClient.product.delete({
            where: {
                id: +req.params.id
            }
        });
    }catch(err){
        throw new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND, null);
    }
   
    res.send("Product deleted!")
}