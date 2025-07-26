import express from "express";
import { postAdmins } from "../controllers/adminController";

const adminRouter = express.Router();

usersRouter.post("/", postAdmins)

export default adminRouter;