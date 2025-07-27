import express from "express";
import { adminLogin, deleteAdmin, getAllAdmins, postAdmins, updateAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/", postAdmins)
adminRouter.post("/login",adminLogin)
adminRouter.get("/", getAllAdmins); 
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", deleteAdmin); 

export default adminRouter;