import {NextFunction, Request, Response} from "express";
import { prismaClient } from "..";
import {compareSync, hashSync} from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorCode } from "../exceptions/root";
import { signUpSchema } from "../schema/users";
import { UnprocessabilityException } from "../exceptions/validations";
import { ZodError } from "zod";
import { NotFoundException } from "../exceptions/notFoundException";


// export const login = (req : Request, res: Response) => {
//     res.send("login works");
// }

export const signUp = async (req:Request, res:Response, next: NextFunction) =>{
    
    const {email, password, name} = req.body;
    try{
        signUpSchema.parse(req.body)
    }catch(err){
        if(err instanceof ZodError){
            throw new UnprocessabilityException("Unprocessible entity", err.errors)
        }
        throw new UnprocessabilityException("Unprocessible entity!", err)
    }
   

    let user = await prismaClient.user.findFirst({where:{email}});

    if(user){
       throw(new BadRequestException("User already exists!", ErrorCode.USESR_ALREADY_EXISTS));
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
         throw(new NotFoundException("User not found!", null));
    }
    if(!compareSync(password, user.password)){
        throw (new BadRequestException("Incorrect password!", ErrorCode.INCORRECT_PASSWORD));
    }
       
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)
    res.json({user, token});

}


