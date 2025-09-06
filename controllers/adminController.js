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
    const { email, password, userName } = req.body;

    // 🔹 1. Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔹 2. Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // 🔹 3. Create new admin
    const newAdmin = new Admin({
      userName,
      email: email.toLowerCase(),
      password: passwordHash,
    });
    await newAdmin.save();

    // 🔹 4. Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOtp = new Otp({ email: newAdmin.email, otp });
    await newOtp.save();

    // 🔹 5. Send OTP via email
    await sendOtpEmail(newAdmin.email, otp);

    res.status(201).json({ message: "Admin created successfully. OTP sent." });
  } catch (error) {
    res.status(500).json({
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

        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

        res.json({
          message: "Login successful",
          user,
          token
        });
      }).catch(() => {
        res.status(500).json({ message: "Login failed due to server error." });
      });
}
export async function updateAdmin(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const adminId = req.params.id;
  const updateData = req.body;

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: "Failed to update admin", error: err.message });
  }
}

// 🧹 Delete admin
export async function deleteAdmin(req, res) {
  if (!isAdminValid(req)) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const adminId = req.params.id;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete admin", error: err.message });
  }
}


export async function getAllAdmins(req, res) {
  try {
    const admins = await Admin.find();
    res.json({ admins });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins", error: err.message });
  }
}


export async function getAdminById(req, res) {
  const adminId = req.params.id;

  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin", error: err.message });
  }
}