import Course from "../model/course.model.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      success: true,
      course,
      message: "Course created successfully.",
    });
  } catch (error) {
    console.error("create course error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course.",
    });
  }
};

export const getAllAdminCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(200).json({
        success: true,
        courses: [],
        message: "No course Found.",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
      message: "All courses are here.",
    });
  } catch (error) {
    console.error("get course error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course.",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLabel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course?.courseThumbnail) {
        const publicId = course.courseThumbnail
          ?.split("/")
          ?.pop()
          .split(".")[0];
        await deleteMedia(publicId); //delete existing thumbnail
      }
      //upload thumbnail on cloudinary
      courseThumbnail = await uploadMedia(thumbnail?.path);
    }
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLabel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(201).json({
      success: true,
      updatedCourse,
      message: "Course updated",
    });
  } catch (error) {
    console.error("Update course error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course.",
    });
  }
};
