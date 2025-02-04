import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file?.path);
    // console.log(result);
    return res.status(200).json({
      success: true,
      message: "file uploaded successfully.",
      data: result,
    });
  } catch (error) {
    console.error("upload video error=>", error);
    return res.status(500).json({
      success: false,
      message: "Failed toupload video.",
    });
  }
});

export default router;
