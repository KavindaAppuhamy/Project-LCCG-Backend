import express from "express";
import { adminLogin, postAdmins } from "../controllers/adminController.js";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";



const adminRouter = express.Router();

adminRouter.post("/", postAdmins)
adminRouter.post("/login",adminLogin)
adminRouter.post("/send", sendOtp);
adminRouter.post("/verify", verifyOtp);

export default adminRouter;