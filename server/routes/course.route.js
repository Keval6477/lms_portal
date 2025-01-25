import express from "express";

import isAutheticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  getAllAdminCourses,
  updateCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/create").post(isAutheticated, createCourse);
router.route("/getAllCourses").get(isAutheticated, getAllAdminCourses);
router
  .route("/updateCourse/:courseId")
  .put(isAutheticated, upload.single("courseThumbnail"), updateCourse);

export default router;
