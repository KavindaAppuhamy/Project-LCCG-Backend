import Otp from "../models/otp.js";
import nodemailer from "nodemailer";

// Configure Nodemailer (You should use env vars in production)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your_email@gmail.com", // Replace with your email
        pass: "your_email_password"   // Replace with your email password or App Password
    }
});

// Generate and send OTP
export async function sendOtp(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Remove existing OTPs for this email
        await Otp.deleteMany({ email });

        // Generate and save new OTP
        const otpCode = Otp.generateOtp();
        const otpEntry = new Otp({ email, otp: otpCode });
        await otpEntry.save();

        // Send OTP via email
        // Extract sender name and email from environment variables
        const NAME = process.env.NAME;
        const EMAIL = process.env.EMAIL;

        // Send OTP via email using Nodemailer
        await transporter.sendMail({
            // Format: "App Name" <email@example.com>
            from: `"${NAME}" <${EMAIL}>`,

            // Recipient's email
            to: email,

            // Subject line of the email
            subject: "Your OTP Code",

            // HTML body of the email with modern styling
            html: `
                <!-- Outer container with background -->
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">

                    <!-- Main card box -->
                    <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; 
                                box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">

                        <!-- Header section with app name and title -->
                        <div style="padding: 20px 30px; text-align: center; background-color: #4f46e5; color: #ffffff;">
                            <h2>${NAME}</h2>
                            <p style="margin: 0;">Your One-Time Password (OTP)</p>
                        </div>

                        <!-- OTP content body -->
                        <div style="padding: 30px; text-align: center;">
                            <p style="font-size: 16px; color: #333;">
                                Use the following OTP to verify your email:
                            </p>

                            <!-- OTP code highlighted -->
                            <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #4f46e5;">
                                ${otpCode}
                            </div>

                            <p style="font-size: 14px; color: #555;">
                                This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.
                            </p>
                        </div>

                        <!-- Footer note -->
                        <div style="padding: 20px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #888;">
                            If you did not request this, please ignore this email.
                        </div>
                    </div>
                </div>
            `
        });
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to send OTP",
            error: err.message
        });
    }
}

// Verify OTP
export async function verifyOtp(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const existingOtp = await Otp.findOne({ email, otp });

        if (!existingOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // OTP is valid
        await Otp.deleteMany({ email }); // Optional: clear OTPs after success
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({
            message: "OTP verification failed",
            error: err.message
        });
    }
}
