import express, {Express, NextFunction, Request, Response} from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';


const app:Express = express();

app.use(express.json())

app.get('/', (req:Request, res:Response) => {
    res.send("Working");
})
app.use('/api', rootRouter);

export const prismaClient: PrismaClient = new PrismaClient({
    log:['query']});

// app.use((req:Request, res:Response, next:NextFunction) =>{
//     console.log("middle ware is invoked")
//     next()
// })
// app.use((req:Request, res:Response, next:NextFunction) =>{
//    res.status(400).json({
//     "message" : "error occured"
//    })
// })
app.use(errorMiddleware)

app.listen(PORT, ()=>{
    console.log("App is working ON " +PORT);
})

