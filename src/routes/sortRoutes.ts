import { Router } from "express";
import { sort } from "../controllers/sortController";


const sortRoutes : Router = Router();

sortRoutes.get('/', sort);

export default sortRoutes;