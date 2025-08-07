import {Router} from "express";
import authRouter from "./auth.route";
import employeeRouter from "./employee.route";
import { authMiddleware } from "../middleware/authMiddleware";

const routers = Router();

routers.get("/",(req,res)=>{
    res.json("Ok!");
});

routers.use("/auth", authRouter);
routers.use("/employee",authMiddleware, employeeRouter);
export default routers;