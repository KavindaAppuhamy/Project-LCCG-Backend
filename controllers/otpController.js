import Otp from "../models/otp.js";
import nodemailer from "nodemailer";
import Admin from "../models/admin.js";
import dotenv from 'dotenv'

dotenv.config()

// Configure Nodemailer (You should use env vars in production)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // Replace with your email
        pass: process.env.PASSWORD   // Replace with your email password or App Password
    }
});

// ✅ Helper: Send email with provided email and otp
export async function sendOtpEmail(email, otpCode) {
  const NAME = process.env.NAME;
  const EMAIL = process.env.EMAIL;

  await transporter.sendMail({
    from: `"${NAME}" <${EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="padding: 20px 30px; text-align: center; background-color: #4f46e5; color: #ffffff;">
                    <h2>${NAME}</h2>
                    <p style="margin: 0;">Your One-Time Password (OTP)</p>
                </div>
                <div style="padding: 30px; text-align: center;">
                    <p style="font-size: 16px; color: #333;">Use the following OTP to verify your email:</p>
                    <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #4f46e5;">
                        ${otpCode}
                    </div>
                    <p style="font-size: 14px; color: #555;">This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.</p>
                </div>
                <div style="padding: 20px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #888;">
                    If you did not request this, please ignore this email.
                </div>
            </div>
        </div>
    `
  });
}

// ✅ Route handler: API /send-otp (regenerates OTP and sends it)
export async function sendOtp(req, res) {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    await Otp.deleteMany({ email });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpEntry = new Otp({ email, otp: otpCode });
    await otpEntry.save();

    await sendOtpEmail(email, otpCode);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
}

// Verify OTP and mark admin as emailVerified = true
export async function verifyOtp(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        // Find OTP entry
        const existingOtp = await Otp.findOne({ email, otp });

        if (!existingOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check for expiration manually
        const now = new Date();
        const otpCreatedAt = existingOtp.createdAt;
        const diffInMs = now - otpCreatedAt;

        if (diffInMs > 5 * 60 * 1000) {
            await Otp.deleteMany({ email }); // Cleanup expired OTPs
            return res.status(400).json({ message: "OTP has expired" });
        }

        // ✅ Mark admin email as verified
        const updatedAdmin = await Admin.findOneAndUpdate(
            { email: email.toLowerCase() },
            { emailVerified: true },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found for this email" });
        }

        // Clean up OTPs
        await Otp.deleteMany({ email });

        res.status(200).json({
            message: "OTP verified and admin email marked as verified",
            admin: {
                _id: updatedAdmin._id,
                email: updatedAdmin.email,
                emailVerified: updatedAdmin.emailVerified
            }
        });

    } catch (err) {
        res.status(500).json({
            message: "OTP verification failed",
            error: err.message
        });
    }
}


