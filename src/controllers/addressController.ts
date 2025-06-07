import { NextFunction, Request, Response } from "express";
import { addressSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFoundException";


export const addAddress = async (req : Request, res: Response, next: NextFunction) => {
 
 addressSchema.parse(req.body);
 const addressExists = await checkAddressExists(+req.user!.id, req.body);
 if(addressExists){
    throw new NotFoundException('Address already exists!', null);
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
    throw new NotFoundException('Address not found!', null);
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
        throw new NotFoundException('Address not found!', null);
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
        throw new NotFoundException('Address not found!', null);
    }
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
