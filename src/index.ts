import express, {Express, Request, Response} from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';


const app:Express = express();

app.use(express.json())

app.get('/', (req:Request, res:Response) => {
    res.send("Working");
})
app.use('/api', rootRouter);
export const prismaClient: PrismaClient = new PrismaClient({
    log:['query']});

app.listen(PORT, ()=>{
    console.log("App is working ON " +PORT);
})

