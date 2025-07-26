import Admin from "../models/admin.js"
import bcrypt from "bcryptjs";
import Otp from "../models/otp.js";
import { sendOtp } from "../controllers/otpController.js";

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
export function postAdmins(req, res) {
  const user = req.body;

  // Hash password
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, 10);
  user.password = passwordHash;

  const newAdmin = new Admin(user);

  newAdmin
    .save()
    .then(() => {
      // Generate 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000);

      const newOtp = new Otp({
        email: req.body.email,
        otp: otp.toString(),
      });

      newOtp.save().then(() => {
        sendOtp(user.email, otp); // Send OTP email
        res.json({ message: "Admin created successfully. OTP sent." });
      });
    })
    .catch(() => {
      res.json({
        message: "Admin creation failed",
      });
    });
}