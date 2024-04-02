import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const JWTToken = user.generateJWTToken()
        return { JWTToken };
    } catch (err) {
        const error = new ApiError(500, "Something went wrong while making the tokens")
        return res.status(error.statusCode).json(error.toResponse());
    }

}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, confirmpassword } = req.body;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{5,}$/;
    // if (!passwordRegex.test(password)){
    //     const error = new ApiError(400, "Password must be at least 5 characters long and contain at least one number, one uppercase letter and one lowercase letter");
    // }
    if (password !== confirmpassword) {
        const error = new ApiError(400, "Passwords Do Not Match");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        const error = new ApiError(408, "Username or Email Already Exists");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.create({
        email,
        username,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -role -score"
    )
    if (!createdUser) {
        const error = new ApiError(500, "Something went wrong while registring the user");
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        const error = new ApiError(408, "Invalid Email Or Password");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        const error = new ApiError(404, "Invalid Password")
        return res.status(error.statusCode).json(error.toResponse());
    }
    const { JWTToken } = await generateTokens(user._id);
    const loggedinuser = await User.findById(user._id).select("-password");
    const options = {
        // httpOnly: true,
        path: '/',
    };

    return res.status(200)
        .cookie("JWTToken", JWTToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedinuser, JWTToken
            }, "User Logged In Successfully")
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        secure: true
    }
    return res.status(200)
        .clearCookie("JWTToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out Successfully")
        )
})

const refereshAccessToken = asyncHandler(async (req, res) => {
    const jwttoken = req.cookies.JWTToken || req.body.JWTToken;
    if (!jwttoken) {
        const error = new ApiError(400, "Refresh Token is required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    try {
        const decodedToken = jwt.verify(
            jwttoken,
            process.env.JWT_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            const error = new ApiError(400, "Invalid Refresh Token");
            return res.status(error.statusCode).json(error.toResponse());
        }
        const options = {
            secure: true
        }
        const { jwtToken } = await generateTokens(user._id);
        return res.status(200)
            .cookie("jwtToken", jwtToken, options)
            .json(
                new ApiResponse(200, {
                    jwtToken
                }, "Token Refreshed")
            )
    } catch (er) {
        const error = new ApiError(405, er?.message || "Invalid Token");
        return res.status(error.statusCode).json(error.toResponse());
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current User Retrieved Successfully")
    )
})

const upDateUserDetails = asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    if (!(req.body?.password || email || username || req.body?.confirmpassword)) {
        const error = new ApiError(410, "Atleast One Field Is Required To Update The Account");
        return res.status(error.statusCode).json(error.toResponse());
    }
    if (req.body?.password !== req.body?.confirmpassword) {
        const error = new ApiError(406, "Passwords Do Not Match");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const currentUser = await User.findById(req.user._id);
    if (req.body.password) {
        currentUser.password = req.body.password;
        await currentUser.save({ ValidateBeforeSave: false });
    }
    if (username && username !== currentUser.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const error = new ApiError(408, "Username Already Exists");
            return res.status(error.statusCode).json(error.toResponse());
        }
    }

    if (email && email !== currentUser.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new ApiError(408, "Email Already Exists");
            return res.status(error.statusCode).json(error.toResponse());
        }
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            email,
            username,
        }
    }, {
        new: true
    }).select("-password -role");
    return res.status(200).json(
        new ApiResponse(200, user, "User Updated Successfully")
    )
})

const updateScore = asyncHandler(async (req, res) => {
    const { score } = req.body;
    if (!score) {
        const error = new ApiError(410, "Score is required to update the user");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            score
        }
    }, {
        new: true
    }).select("-password -role");
    return res.status(200).json(
        new ApiResponse(200, user, "User Score Updated Successfully")
    )
})

const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        const error = new ApiError(410, "Invalid or missing UserId");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const Profile = await User.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId.createFromHexString(userId)
            },
        },
        {
            $project: {
                username: 1,
                email: 1,
                password: 1,
                score: 1,
            }
        }
    ])
    if (!Profile?.length) {
        const error = new ApiError(404, "Profile Not Found");
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, Profile[0], "Profile Retrieved Successfully")
    )
})

const deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        const error = new ApiError(400, "User Does Not Exist");
        return res.status(error.statusCode).json(error.toResponse());
    }
    await User.findByIdAndDelete(req.user?._id);
    return res.status(200).json(
        new ApiResponse(200, {}, "User Deleted Successfully")
    )
})

//Admin Controllers
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({role: "user"}).select("-password");
    if (!users) {
        const error = new ApiError(404, "No Users Found");
        return res.status(error.statusCode).json(error.toResponse());
    }
    if (!users.length) {
        return res.status(200).json(
            new ApiResponse(200, users, "All Users Retrieved Successfully")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, users, "All Users Retrieved Successfully")
    )
})

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        const error = new ApiError(410, "Invalid or missing UserId");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.findById(userId);
    if (!user) {
        const error = new ApiError(404, "User Not Found");
        return res.status(error.statusCode).json(error.toResponse());
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json(
        new ApiResponse(200, {}, "User Deleted Successfully")
    )
});

export { registerUser, loginUser, logoutUser, refereshAccessToken, getCurrentUser, upDateUserDetails, updateScore , getUserProfile, deleteUserAccount, getAllUsers, deleteUser};