import express from "express";
backend/dhananjaya
import { adminLogin, deleteAdmin, postAdmins, updateAdmin } from "../controllers/adminController.js";
import { postAdmins } from "../controllers/adminController.js";
dev

const adminRouter = express.Router();

adminRouter.post("/", postAdmins)
backend/dhananjaya
adminRouter.post("/login",adminLogin)
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", deleteAdmin); 
dev

export default adminRouter;