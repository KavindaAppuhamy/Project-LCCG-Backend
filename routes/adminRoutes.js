import express from "express";
import { postAdmins } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/", postAdmins)

export default adminRouter;