const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minlength: [4, "Name should have more than 4 characters"],
    },

    lname: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minlength: [4, "Name should have more than 4 characters"],
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        maxLength: [8, "Password should be greater than 4 characters"],
        select: false,
    },

    dob: {
        type: String,
        required: [false, "Please Enter Your Date of Birth"],
    },

    contact: {
        type: String,
        required: [false, "Please Enter Your Contact Number"],
        maxLength: [10, "Name cannot exceed 10 number"],
        minlength: [9, "Name should have more than 9 number"],
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [false, "Please Select Your Gender"],
    },

    address: {
        pincode: {
            type: Number,
            maxLength: [6, "Pincode cannot exceed 6 number"],
            minlength: [6, "should have more than 6 number"],
        },
        city: {
            type: String,
            required: [false, 'Please fill city'],
        },
        mystate: {
            type: String,
            required: [false, 'Please fill State'],
        },
        country: {
            type: String,
            required: [false, 'Please fill Country'],
        },
        building: {
            type: String,
            required: [false, 'Please fill Building area'],
        },
        locality: {
            type: String,
            required: [false, 'Please fill Locality'],
        },
        landmark: {
            type: String,
            required: [false, 'Please fill Landmark'],
        }

    },
    secondaddress: {
        secpincode: {
            type: Number,
            maxLength: [6, "Pincode cannot exceed 6 number"],
            minlength: [6, "should have more than 6 number"],
        },
        seccity: {
            type: String,
            required: [false, 'Please fill city'],
        },
        secmystate: {
            type: String,
            required: [false, 'Please fill State'],
        },
        seccountry: {
            type: String,
            required: [false, 'Please fill Country'],
        },
        secbuilding: {
            type: String,
            required: [false, 'Please fill Building area'],
        },
        seclocality: {
            type: String,
            required: [false, 'Please fill Locality'],
        },
        seclandmark: {
            type: String,
            required: [false, 'Please fill Landmark'],
        }

    },

    role: {
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    };

    this.password = await bcrypt.hash(this.password, 10);
})
// JWT TOKEN
userSchema.methods.getJWTTOKEN = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};
module.exports = mongoose.model("User", userSchema);



