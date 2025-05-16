import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFoundException";
import { productSchema } from "../schema/products";
import { UnprocessabilityException } from "../exceptions/validations";
import { ZodError } from "zod";

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
        throw new NotFoundException("Product not found!", null);
    }
 
}

// get list of products

export const getProductList = async (req: Request, res: Response, next: NextFunction) => {

    // response structure
    // { count : int, data: []}
    const count = await prismaClient.product.count
    const products = await prismaClient.product.findMany({
       take: 5,
       skip: +req.query.skip! || 0,
    })
    res.json({
        count,
        data: products
    });
}

// create product



export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try{
        productSchema.parse(req.body);
    }catch(err){
        if(err instanceof ZodError){
            throw new UnprocessabilityException("Unprocessible entity", err.errors);
        }else{
            throw new UnprocessabilityException("Unprocessible entity", err);
        }
    }
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
        throw new NotFoundException("Product not found!", null)
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
        throw new NotFoundException("Product not found!", null);
    }
   
    res.send("Product deleted!")
}