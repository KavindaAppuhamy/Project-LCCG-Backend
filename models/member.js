import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    mylci: {
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Gender is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    occupation: {
        type: String,
        required: [true, 'Occupation is required'],
        trim: true,
        enum: {
            values: [
                'School Student',
                'A/L Student',
                'O/L Student',
                'University Undergraduate',
                'Vocational Training Student',
                'Graduate Student',
                'Intern / Trainee',
                'Junior Software Engineer',
                'Assistant Teacher',
                'Customer Service Representative',
                'Freelance Designer / Developer',
                'Youth Volunteer',
                'Environmental Activist',
                'Blood Donation Organizer',
                'Event Coordinator',
                'Social Media Volunteer',
                'Web Developer',
                'Graphic Designer',
                'Content Creator',
                'Photographer / Videographer',
                'App Developer',
                'Small Business Owner',
                'Marketing Assistant',
                'Sales Executive',
                'Finance Trainee',
                'Business Management Student',
                'Nursing Student',
                'Medical Intern',
                'Psychology Student',
                'Social Work Volunteer',
                'Engineering Undergraduate',
                'Technician (Electrical / Mechanical)',
                'IT Support Assistant',
                'CAD Designer',
                'Peer Tutor',
                'Teaching Assistant',
                'Educational Content Creator'
            ],
            message: 'Please select a valid occupation'
        }
    },    
    joinDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['accept', 'reject', 'pending'],
        default: 'pending',
        required: [true, 'Status is required']
    },
    position: {
        type: String,
        trim: true,
        required: [true, 'Position is required'],
    },
    image: {
        type: String, // This will store the path or URL to the image
        default: 'https://www.w3schools.com/howto/img_avatar.png' // Default image URL
    }
}, 

// Adds createdAt and updatedAt fields automatically
{
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
memberSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
memberSchema.virtual('age').get(function() {
    if (!this.dob) return null;
    const diff = Date.now() - this.dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// Middleware to ensure email is lowercase before saving
memberSchema.pre('save', function(next) {
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    next();
});

const Member = mongoose.model("Member", memberSchema);

export default Member; 