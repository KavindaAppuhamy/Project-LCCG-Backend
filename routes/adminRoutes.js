import express from "express";
import { adminLogin, deleteAdmin, postAdmins, updateAdmin } from "../controllers/adminController.js";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";



const adminRouter = express.Router();

adminRouter.post("/", postAdmins)
adminRouter.post("/login",adminLogin)
adminRouter.post("/send", sendOtp);
adminRouter.post("/verify", verifyOtp);
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", deleteAdmin); 

export default adminRouter;