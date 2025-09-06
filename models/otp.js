import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    otp: {
        type: String,
        required: [true, 'OTP is required'],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
        expires: 300 // Document will automatically expire after 5 minutes (300 seconds)
    }
}, 

{
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Index for faster querying by email
otpSchema.index({ email: 1 });

// Pre-save hook to ensure email is lowercase
otpSchema.pre('save', function(next) {
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    next();
});

otpSchema.statics.generateOtp = function() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;