import {NextFunction, Request, Response} from "express";
import { prismaClient } from "..";
import {compareSync, hashSync} from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorCode } from "../exceptions/root";

// export const login = (req : Request, res: Response) => {
//     res.send("login works");
// }

export const signUp = async (req:Request, res:Response, next: NextFunction) =>{
    const {email, password, name} = req.body;

    let user = await prismaClient.user.findFirst({where:{email}});

    if(user){
       return next(new BadRequestException("User already exists!", ErrorCode.USESR_ALREADY_EXISTS));
    }
       
    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password : hashSync(password, 10)
        }
    })
    res.json(user);

}

export const login = async (req:Request, res:Response, next: NextFunction) =>{
    const {email, password} = req.body;

    let user = await prismaClient.user.findFirst({where:{email}});
    if(!user){
        throw Error("User not found!");
    }
    if(!compareSync(password, user.password)){
        throw Error("Incorrect password!")
    }
       
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)
    res.json({user, token});

}


