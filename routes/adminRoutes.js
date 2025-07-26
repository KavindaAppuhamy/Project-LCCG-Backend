import express from "express";
import { postAdmins } from "../controllers/adminController";
import { sendOtp, verifyOtp } from "../controllers/otpController";

const adminRouter = express.Router();

adminRouter.post("/", postAdmins)
adminRouter.post("/send", sendOtp);
adminRouter.post("/verify", verifyOtp);

export default adminRouter;