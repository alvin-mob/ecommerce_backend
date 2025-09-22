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

export const prismaClient = new PrismaClient({
    log:['query']})
    .$extends({
        result: {
            address:{
                formattedAddress:{
                    needs:{
                        lineOne: true,
                        lineTwo: true,
                        city: true,
                        country: true,
                        pincode: true
                    },
                    compute: (addr) =>{
                        return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
                    }
                }
            }
        }
    })

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

