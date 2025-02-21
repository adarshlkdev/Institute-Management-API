import Fee from "../models/Fee.model.js";
import Course from "../models/Course.model.js";

export const addFee = async (req, res) => {
  try {
    const { fullName, phone, courseId, feeAmount, isPaid, remark } = req.body;

    if (!fullName || !phone || !courseId || !feeAmount || !isPaid) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const newFee = new Fee({
      fullName,
      phone,
      courseId,
      feeAmount,
      isPaid,
      remark,
      paidTo: req.userData.userId,
    });

    await newFee.save();

    res.status(201).json({
      success: true,
      message: "Fee added successfully",
      data: {
        ...newFee._doc,
        createdAt: newFee.createdAt.toISOString(),
        updatedAt: undefined,
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

export const paymentHistory = async (req, res) => {
  try {
    const fees = await Fee.find({ paidTo: req.userData.userId })
      .populate("courseId", "courseName description price duration")
      .populate("paidTo", "firstName lastName email")
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt -__v");

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "No fees history found",
      });
    }

    res.status(200).json({
      success: true,
      data: fees,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getFeeIntoCourse = async (req, res) => {
  try {
    const { courseId, phone } = req.query;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const fees = await Fee.find({
      paidTo: req.userData.userId,
      courseId,
      phone,
    })
      .select("-createdAt -updatedAt -__v")
      .populate("courseId", "courseName description price duration")
      .populate("paidTo", "firstName lastName email");
    if (fees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No fees found for this course",
      });
    }

    res.status(200).json({
      success: true,
      data: fees,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
