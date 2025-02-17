import Student from "../models/Student.model.js";
import cloudinary from "../config/cloudinary.js";

export const addStudent = async (req, res) => {
  try {
    const { fullName, phone, email, address, courseId } = req.body;
    if (!fullName || !phone || !email || !address || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const newStudent = new Student({
      fullName,
      phone,
      email,
      address,
      imageUrl: req.file.path,
      imageId: req.file.filename,
      addedBy: req.userData.userId,
      enrolledCourses: [courseId],
    });

    await newStudent.save();

    const studentResponse = await Student.findById(newStudent._id)
      .select("-imageId -createdAt -updatedAt -__v")
      .sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Student added successfully.",
      data: {
        studentResponse,
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

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({
      addedBy: req.userData.userId,
    })
      .select("-imageId -createdAt -updatedAt -__v")
      .sort({ createdAt: -1 })
      .populate("enrolledCourses", "courseName description price duration")
      .populate("addedBy", "email firstName lastName");

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found.",
      });
    }

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a student id.",
      });
    }
    const student = await Student.findById(studentId)
      .select("-imageId -createdAt -updatedAt -__v")
      .populate("enrolledCourses", "courseName description price duration")
      .populate("addedBy", "email firstName lastName");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudentIntoCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a course id.",
      });
    }
    const students = await Student.find({
      enrolledCourses: courseId,
      addedBy: req.userData.userId,
    })
      .populate("enrolledCourses", "courseName description price duration")
      .populate("addedBy", "email firstName lastName")
      .select("-imageId -createdAt -updatedAt -__v")
      .sort({ createdAt: -1 });

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found in this course.",
      });
    }
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a student id.",
      });
    }
    const { fullName, phone, email, address, courseId } = req.body;
    if (!fullName || !phone || !email || !address || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (student.addedBy.toString() !== req.userData.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this student.",
      });
    }

    const updatedStudent = {
      fullName: fullName || student.fullName,
      phone: phone || student.phone,
      email: email || student.email,
      address: address || student.address,
      enrolledCourses: courseId ? [courseId] : student.enrolledCourses,
    };

    let imageUrl = student.imageUrl;
    let imageId = student.imageId;

    if (req.file) {
      await cloudinary.uploader.destroy(student.imageId);
      imageUrl = req.file.path;
      imageId = req.file.filename;
    }

    await Student.findByIdAndUpdate(studentId, {
      ...updatedStudent,
      imageUrl,
      imageId,
    });

    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getLatestStudents = async (req, res) => {
  try {
    const { limit } = req.query;
    const students = await Student.find({ addedBy: req.userData.userId })
      .populate("enrolledCourses", "courseName description price duration")
      .populate("addedBy", "email firstName lastName")
      .select("-imageId -createdAt -updatedAt -__v")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found.",
      });
    }
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a student id.",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (student.addedBy.toString() !== req.userData.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this student.",
      });
    }

    await Student.findByIdAndDelete(studentId);
    await cloudinary.uploader.destroy(student.imageId);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
