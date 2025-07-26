import Admin from "../models/admin.js"
import bcrypt from "bcryptjs";
import Otp from "../models/otp.js";
import { sendOtpEmail } from "../controllers/otpController.js";

export function isAdminValid(req) {
  if (!req.user) {
    return false;
  }

  const { status, emailVerified, disabled } = req.user;

  if (
    status !== "accept" ||     
    !emailVerified ||          
    disabled                   
  ) {
    return false;
  }

  return true;
}


//creeate admin
export async function postAdmins(req, res) {
  try {
    const user = req.body;

    // Hash password
    const password = user.password;
    const passwordHash = bcrypt.hashSync(password, 10);
    user.password = passwordHash;

    const newAdmin = new Admin(user);
    await newAdmin.save();

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOtp = new Otp({ email: user.email, otp });
    await newOtp.save();

    // Send email
    await sendOtpEmail(user.email, otp);

    res.json({ message: "Admin created successfully. OTP sent." });
  } catch (error) {
    res.json({
      message: "Admin creation failed",
      error: error.message,
    });
  }
}

export const authenticate = (req, res, next) => {
    // check JWT, decode user, attach to req.user
    next();
};