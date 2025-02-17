import Course from "../models/Course.model.js";
import cloudinary from "../config/cloudinary.js";

export const addCourse = async (req, res) => {
  try {
    const { courseName, description, price, duration } = req.body;

    if (!courseName || !description || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const newCourse = new Course({
      courseName,
      description,
      price,
      duration,
      imageUrl: req.file.path,
      imageId: req.file.filename,
      createdBy: req.userData.userId,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course added successfully.",
      data: {
        courseName: newCourse.courseName,
        description: newCourse.description,
        price: newCourse.price,
        duration: newCourse.duration,
        imageUrl: newCourse.imageUrl,
        createdBy: newCourse.createdBy,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.userData._id })
      .populate("createdBy", "email")
      .select("-imageId -__v -createdAt -updatedAt")
      .sort({ createdAt: -1 });
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found." });
    }
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .select("-imageId -__v -createdAt -updatedAt")
      .populate("createdBy", "email");

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    if (course.createdBy.toString() !== req.userData.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course.",
      });
    }
    await Course.findByIdAndDelete(courseId);
    await cloudinary.uploader.destroy(course.imageId);

    res.status(200).json({ success: true, message: "Course deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide course id" });
    }

    const course = await Course.findById(courseId).populate(
      "createdBy",
      "email"
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.createdBy.toString() !== req.userData.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course.",
      });
    }

    const { courseName, description, price, duration } = req.body;

    if (!courseName || !description || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    let imageUrl = course.imageUrl;
    let imageId = course.imageId;

    if (req.file) {
      await cloudinary.uploader.destroy(course.imageId);
      imageUrl = req.file.path;
      imageId = req.file.filename;
    }

    await Course.findByIdAndUpdate(courseId, {
      courseName,
      description,
      price,
      duration,
      imageUrl,
      imageId,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getLatestCourses = async (req, res) => {
  try {
    const { limit } = req.query;
    const courses = await Course.find({ createdBy: req.userData.userId })
      .populate("createdBy", "email")
      .select("-imageId -__v -createdAt -updatedAt")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found." });
    }
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.log(error);
  }
};
