const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")
//const bcrypt = require("bcrypt");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Contact = require("../models/contactModel")



exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password, fname, lname, contact ,dob, gender } = req.body;

    const user = await User.create({
        email,
        password,
        fname,
        lname,
        contact,
        dob,
        gender
    });
    // const token = user.getJWTTOKEN();
    // res.status(200).json({
    //     success: true,
    //     message: "User register succefully",
    //     user,
    //     token,
    // })

    sendToken(user, 201, res);
});

// Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    
    const { email, password } = req.body;

    // Checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Inavlid Email Or Password", 401));
    }

    //const isPasswordMatched = await bcrypt.compare(password, user.password);
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Inavlid Email Or Password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });


    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();


    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `http://localhost:3000/confirmpassword/${resetToken}`;

    const message = `Your password reset url is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `TshirtHub Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHander(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById({ _id: req.params.id }).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    try {
        const { fname, lname, email, contact, dob, gender, address } = req.body;
        const user = await User.findById(req.user._id);
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                fname: fname || user.fname,
                lname: lname || user.lname,
                email: email || user.email,
                contact: contact || user.contact,
                dob: dob || user.dob,
                gender: gender || user.gender,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
});


// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});


// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});


exports.checkUser = async (req, res, next) => {
    const tokenFind = () => {
        try {
            // check if token found in cookies
            if (req.cookies.token) {
                return req.cookies.token;
            }
            // check if token found body
            if (req.body.token) {
                return req.body.token;
            }
            //check if token found in header
            if (req.header("Authorization")) {
                return req.header("Authorization").replace("Bearer ", "");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const token = tokenFind();

    if (token) {
        // decoding the token with scerect key
        //   const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //   // asign to a var
        //   const found = await User.findById(decoded.id);

        //   if (found) {
        //     return res.status(200).redirect("/dashboard");
        //   } else {
        res.status(200).json({
            success: true,
            token: true
        });
    }
    else {
        res.status(500).json({
            success: false,
            token: false
        });
    }
    next();
};


// Message from contact
exports.contactUs = catchAsyncErrors(async (req, res, next) => {
    const {email, message } = req.body;

    const user = await Contact.create({
        email,
        message
    });
    res.status(200).json({
        success: true,
        message: "Message send successfully"
    });
});

// Message from contact
exports.allMessage = catchAsyncErrors(async (req, res, next) => {
    const message = await Contact.find();
    res.status(200).json({
        success: true,
        message: "Message send successfully",
        message
    });
});


exports.deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const user = await Contact.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});
