import express from "express";
import {
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";
import isAutheticated from "../middlewares/isAuthenticated.js";
import { uploadMedia } from "../utils/cloudinary.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isAutheticated, logout);
router.route("/profile").get(isAutheticated, getUserProfile);
router
  .route("/updateProfile")
  .put(isAutheticated, upload.single("profilePhoto"), updateProfile);

export default router;
