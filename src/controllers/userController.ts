import { NextFunction, Request, Response } from "express";
import { addressSchema, updateUserSchemma } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFoundException";
import { Address } from "@prisma/client";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/badRequestException";


export const addAddress = async (req : Request, res: Response, next: NextFunction) => {
 
 addressSchema.parse(req.body);
 const addressExists = await checkAddressExists(+req.user!.id, req.body);
 if(addressExists){
    throw new NotFoundException('Address already exists!', ErrorCode.ADDRESS_NOT_FOUND, null);
 }
 const address = await prismaClient.address.create({
    data: {
        ...req.body,
        userId : req.user!.id
    }
 });
 res.json(address);
}

export const getAddresses = async (req : Request, res: Response, next: NextFunction) => {
   try{
    const addresses = await prismaClient.address.findMany({
        where:{
            userId : req.user!.id
        }
    });
    res.json(addresses);
   }catch(err){
    throw new NotFoundException('Address not found!',ErrorCode.ADDRESS_NOT_FOUND, null);
   } 
}

export const updateAddress = async (req : Request, res: Response, next: NextFunction) => {
    
    addressSchema.parse(req.body);
    try{
        const address = await prismaClient.address.update({
            where : {
                id: +req.body.id
            },
            data: req.body
        });
        res.json(address)
    }catch(err){
        throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND,null);
    }
}

export const deleteAddress = async (req : Request, res: Response, next: NextFunction) => {
    try{
        const address = await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        })
        res.send("Address deleted")
    }catch(err){
        throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND, null);
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = updateUserSchemma.parse(req.body)
    let shippingAddress : Address;
    let billingAddress : Address;
    if(validatedData.defaultShippingAddress){
        try{
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }

        })
        }catch(errror){
            throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND, null);
        }
        //  check whether the address belong the correct user
        if(shippingAddress.id != req.user?.id){
            throw new BadRequestException("Address does not belong to the user", ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }
    if(validatedData.defaultBillingAddress){
        try{
           billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
        })
        }catch(errror){
            throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND, null);
        }
         //  check whether the address belong the correct user
         if(billingAddress.id != req.user?.id){
            throw new BadRequestException("Address does not belong to the user", ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

   const updatedUser = await prismaClient.user.update({
    where :{
        id : req.user?.id
    },
    data : {
        ...validatedData
    }
   });
   res.json(updatedUser);
}

async function checkAddressExists(userId: number, addressData: any){
    return await prismaClient.address.findFirst({
        where:{
            userId: userId,
            lineOne: addressData.lineOne,
            lineTwo: addressData.line2,
            pincode: addressData.pincode
        }   
    })
}



