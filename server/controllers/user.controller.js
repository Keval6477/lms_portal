import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
// import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashPassword });
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.log("Error in register user==>>".error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const token = generateToken(user);
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        user,
        message: "User logged in successfully.",
      });
    //  const data = generateToken(user);
    // console.log(data);
  } catch (error) {
    console.log("Error in login user==>>".error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to logout.",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    console.log("call");
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in getUserProfile", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch User.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    // if(req.fie)
    // const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    //extract public id of old image from the url if it exists;
    // if (user.photoUrl) {
    //   const publicId = user.photoUrl.split("/").pop().split(".")[0];
    //   deleteMedia(publicId);
    // }
    // // uploadNewPhoto
    // const cloudResponse = await uploadMedia(profilePhoto.path);
    // const { secure_url: photoUrl } = cloudResponse;
    const updateData = { name};

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateUserProfile", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update User.",
    });
  }
};