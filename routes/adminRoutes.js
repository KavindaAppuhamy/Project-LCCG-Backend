import express from "express";
import { adminLogin, deleteAdmin, getAdminById, getAllAdmins, postAdmins, updateAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/", postAdmins)
adminRouter.post("/login",adminLogin)
adminRouter.get("/", getAllAdmins); 
adminRouter.get("/:id", getAdminById); 
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", deleteAdmin); 

export default adminRouter;