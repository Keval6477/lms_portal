import express from "express";

import isAutheticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  getAllAdminCourses,
  getCourseById,
  getCourseLecture,
  getLectureById,
  getPublishedCourse,
  lectureCreate,
  removeLecture,
  togglePublishCourse,
  updateCourse,
  updateLecture,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/create").post(isAutheticated, createCourse);
router.route("/getAllCourses").get(isAutheticated, getAllAdminCourses);
router
  .route("/updateCourse/:courseId")
  .put(isAutheticated, upload.single("courseThumbnail"), updateCourse);
router.route("/getcourse/:courseId").get(isAutheticated, getCourseById);
router.route("/:courseId/createLecture").post(isAutheticated, lectureCreate);
router.route("/:courseId/getLectures").get(isAutheticated, getCourseLecture);
router
  .route("/:courseId/lecture/:lectureId")
  .post(isAutheticated, updateLecture);
router.route("/lecture/:lectureId").delete(isAutheticated, removeLecture);
router.route("/lecture/:lectureId").get(isAutheticated, getLectureById);
router.route("/:courseId").patch(isAutheticated, togglePublishCourse);
router.route("/publishedCourses").get(isAutheticated, getPublishedCourse);

export default router;
