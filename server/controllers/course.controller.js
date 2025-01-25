import Course from "../model/course.model.js";

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
