import express from "express";
import { postAdmins } from "../controllers/adminController.js";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";



const adminRouter = express.Router();

adminRouter.post("/", postAdmins)
adminRouter.post("/send", sendOtp);
adminRouter.post("/verify", verifyOtp);

export default adminRouter;