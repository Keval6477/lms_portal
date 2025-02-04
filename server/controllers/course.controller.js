import Course from "../model/course.model.js";
import Lecture from "../model/lecture.model.js";
import { deleteMedia, deleteVideo, uploadMedia } from "../utils/cloudinary.js";

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
      courseLevel,
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
      courseLevel,
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

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    // console.log(courseId);
    const course = await Course.findById(courseId);
    // console.log(course);
    if (!course) {
      return res.status(404).json({
        success: true,
        message: "Course not found",
        course: {},
      });
    }
    return res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("get course by id error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course.",
    });
  }
};

export const lectureCreate = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    //  console.log(lectureTitle);
    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "all fields are required.",
      });
    }
    const lecture = await Lecture.create({ lectureTitle });
    //get course
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      success: true,
      message: "Lecture created successfully.",
      // lecture,
    });
  } catch (error) {
    console.error("create Lecture error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture.",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Lecure not found.",
        lectures: [],
      });
    }
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error("get Lecture error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture.",
    });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { lectureTitle, isPreviewFree, videoInfo } = req.body;
    const { courseId, lectureId } = req.params;
    console.log(videoInfo);

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(400).json({
        success: false,
        message: "LEcture not found.",
      });
    }
    //update lecture
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }
    if (videoInfo.videoUrl) {
      lecture.videoUrl = videoInfo?.videoUrl;
    }
    if (videoInfo.publicId) {
      lecture.publicId = videoInfo?.publicId;
    }
    if (isPreviewFree) {
      lecture.isPreviewFree = isPreviewFree;
    }
    await lecture.save();

    //update course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "LEcture not found.",
      });
    }
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("update Lecture error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture.",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(400).json({
        success: false,
      });
    }
    //remove lecture video from cloudinary
    if (lecture?.publicId) {
      await deleteVideo(lecture?.publicId);
    }
    //remove lecture from course as well
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    ); //  remove lecture from course
    return res.status(200).json({
      success: true,
      message: "Lecture deleted",
    });
  } catch (error) {
    console.error("remove Lecture error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture.",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    console.log(lecture);
    if (!lecture) {
      return res.status(400).json({
        success: false,
        message: "NO Lecture found.",
      });
    }
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("failed to get Lecture error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture.",
    });
  }
};

///publish and unpublish course

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true or false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found.",
      });
    }
    //publish status based on query parameter
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Course is ${statusMessage}.`,
      course,
    });
  } catch (error) {
    console.error("failed to update status error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status.",
    });
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses.length) {
      return res
        .status(404)
        .json({ success: false, courses: [], message: "Course not found." });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("failed to get publish course error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get publish course.",
    });
  }
};
