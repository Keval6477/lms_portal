import express from "express";

import isAutheticated from "../middlewares/isAuthenticated.js";
import { createCourse, getAllAdminCourses } from "../controllers/course.controller.js";

const router = express.Router();

router.route("/create").post(isAutheticated, createCourse);
router.route("/getAllCourses").get(isAutheticated, getAllAdminCourses);

export default router;
