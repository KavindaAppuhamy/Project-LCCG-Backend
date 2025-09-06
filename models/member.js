import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s'-]+$/.test(v);
            },
            message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
        }
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s'-]+$/.test(v);
            },
            message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
        }
    },
    mylci: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        uppercase: true,
        minlength: [3, 'MYLCI must be at least 3 characters long'],
        maxlength: [20, 'MYLCI cannot exceed 20 characters'],
        set: v => {
            if (!v || v.trim() === "") return null;
            return v.trim().toUpperCase();
        },
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow null/undefined (sparse index handles uniqueness)
                return /^[A-Z0-9]+$/.test(v);
            },
            message: 'MYLCI can only contain uppercase letters and numbers'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [100, 'Email cannot exceed 100 characters'],
        validate: [
            {
                validator: function(v) {
                    // Comprehensive email validation regex
                    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v);
                },
                message: 'Please provide a valid email address'
            },
            {
                validator: function(v) {
                    // Additional checks for common email issues
                    return !v.includes('..') && // No consecutive dots
                           !v.startsWith('.') && // No leading dot
                           !v.endsWith('.') && // No trailing dot
                           !v.includes('@.') && // No dot immediately after @
                           !v.includes('.@'); // No dot immediately before @
                },
                message: 'Email format contains invalid characters or structure'
            }
        ]
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Phone number is required'],
        validate: [
            {
                validator: function(v) {
                    // Remove all non-digit characters for validation
                    const cleaned = v.replace(/\D/g, '');
                    
                    // Sri Lankan mobile numbers: 10 digits starting with 07
                    // Or with country code: +94 followed by 9 digits (without leading 0)
                    // Landline: 10 digits starting with area codes (011, 021, 023, 024, 025, 026, 027, 031, 032, 033, 034, 035, 036, 037, 038, 041, 045, 047, 051, 052, 054, 055, 057, 063, 065, 066, 067, 081, 091)
                    
                    if (cleaned.startsWith('94')) {
                        // International format: +94XXXXXXXXX (12 digits total)
                        return cleaned.length === 12 && /^94[1-9]\d{8}$/.test(cleaned);
                    } else {
                        // Local format: 10 digits
                        if (cleaned.length !== 10) return false;
                        
                        // Mobile numbers: start with 07
                        if (cleaned.startsWith('07')) {
                            return /^07[0-8]\d{7}$/.test(cleaned);
                        }
                        
                        // Landline numbers: valid area codes
                        const validAreaCodes = [
                            '011', '021', '023', '024', '025', '026', '027',
                            '031', '032', '033', '034', '035', '036', '037', '038',
                            '041', '045', '047',
                            '051', '052', '054', '055', '057',
                            '063', '065', '066', '067',
                            '081', '091'
                        ];
                        
                        const areaCode = cleaned.substring(0, 3);
                        return validAreaCodes.includes(areaCode);
                    }
                },
                message: 'Please provide a valid Sri Lankan phone number (mobile: 07XXXXXXXX or landline with valid area code, or international format: +94XXXXXXXXX)'
            },
            {
                validator: function(v) {
                    // Check format with common separators and country code
                    const patterns = [
                        /^07[0-8]\d{7}$/, // Mobile: 0771234567
                        /^07[0-8]\s\d{3}\s\d{4}$/, // Mobile: 077 123 4567
                        /^07[0-8]-\d{3}-\d{4}$/, // Mobile: 077-123-4567
                        /^\+94\s?[1-9]\d{8}$/, // International: +94 771234567
                        /^\+94\s?[1-9]\d\s\d{3}\s\d{4}$/, // International: +94 77 123 4567
                        /^0(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\d{7}$/, // Landline: 0112345678
                        /^0(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\s\d{3}\s\d{4}$/, // Landline: 011 234 5678
                        /^0(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)-\d{3}-\d{4}$/ // Landline: 011-234-5678
                    ];
                    
                    return patterns.some(pattern => pattern.test(v));
                },
                message: 'Phone number format is invalid. Use formats like: 0771234567, 077 123 4567, +94 771234567, or valid landline numbers'
            }
        ],
        set: function(v) {
            // Clean and format phone number
            let cleaned = v.replace(/\s+/g, ' ').trim();
            
            // Standardize international format
            if (cleaned.startsWith('+94 ')) {
                cleaned = cleaned.replace('+94 ', '+94');
            }
            
            return cleaned;
        }
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: [
            {
                validator: function(v) {
                    const today = new Date();
                    const minAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
                    const maxAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
                    return v >= minAge && v <= maxAge;
                },
                message: 'Date of birth must be between 16 and 120 years ago'
            },
            {
                validator: function(v) {
                    return v <= new Date();
                },
                message: 'Date of birth cannot be in the future'
            }
        ]
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: 'Gender must be either male, female, or other'
        },
        required: [true, 'Gender is required'],
        lowercase: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [10, 'Address must be at least 10 characters long'],
        maxlength: [200, 'Address cannot exceed 200 characters'],
        validate: {
            validator: function(v) {
                // Basic address validation - should contain letters and numbers
                return /^[a-zA-Z0-9\s,.-/#]+$/.test(v);
            },
            message: 'Address contains invalid characters'
        }
    },
    occupation: {
        type: String,
        required: [true, 'Occupation is required'],
        trim: true,
        minlength: [2, 'Occupation must be at least 2 characters long'],
        maxlength: [100, 'Occupation cannot exceed 100 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s&,-./()]+$/.test(v);
            },
            message: 'Occupation contains invalid characters'
        }
    },    
    joinDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function(v) {
                // Join date should not be more than 1 day in the future
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return v <= tomorrow;
            },
            message: 'Join date cannot be more than 1 day in the future'
        }
    },
    status: {
        type: String,
        enum: {
            values: ['accept', 'reject', 'pending'],
            message: 'Status must be either accept, reject, or pending'
        },
        default: 'pending',
        required: [true, 'Status is required'],
        lowercase: true
    },
    position: {
        type: String,
        trim: true,
        default: 'Member',
        maxlength: [50, 'Position cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow empty/null values
                return /^[a-zA-Z\s&,-./()]+$/.test(v);
            },
            message: 'Position contains invalid characters'
        }
    },
    image: {
        type: String,
        default: 'https://www.w3schools.com/howto/img_avatar.png',
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow null/undefined
                
                // Check for valid URL format
                const urlPattern = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;
                // Check for valid file path
                const filePathPattern = /^\/[a-zA-Z0-9\/._-]+\.(jpg|jpeg|png|gif|webp)$/i;
                
                return urlPattern.test(v) || filePathPattern.test(v);
            },
            message: 'Image must be a valid URL or file path'
        }
    }
}, {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
memberSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual to check if member is adult
memberSchema.virtual('isAdult').get(function() {
    return this.age >= 18;
});

const Member = mongoose.model("Member", memberSchema);

export default Member;