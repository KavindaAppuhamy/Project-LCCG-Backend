import Admin from "../models/admin.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
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
export function adminLogin(req, res) {
      const credentials = req.body;

      Admin.findOne({ email: credentials.email }).then((user) => {
        if (!user) {
          return res.status(403).json({
            message: "User not found"
          });
        }

        const passwordMatch = bcrypt.compareSync(credentials.password, user.password);
        if (!passwordMatch) {
          return res.status(403).json({
            message: "Incorrect password"
          });
        }

        // ✅ Check status, emailVerified, and disabled from DB user object
        if (
          user.status !== "accept" ||
          !user.emailVerified ||
          user.disabled
        ) {
          return res.status(403).json({
            message: "Account not active. Please verify your email or wait for approval."
          });
        }

        // ✅ Create JWT token if everything is valid
        const payload = {
          id: user._id,
          email: user.email,
          userName: user.userName,
          status: user.status,
          disabled: user.disabled,
          emailVerified: user.emailVerified,
        };

        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "48h" });

        res.json({
          message: "Login successful",
          user,
          token
        });
      }).catch(() => {
        res.status(500).json({ message: "Login failed due to server error." });
      });
}