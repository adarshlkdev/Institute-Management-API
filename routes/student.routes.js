import express from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import upload from "../middlewares/multer.js";
import {
  getStudentIntoCourse,
  getStudentById,
  deleteStudent,
  addStudent,
  getAllStudents,
  updateStudent,
  getLatestStudents,
} from "../controllers/Student.controller.js";

const router = express.Router();

router.post("/add", checkAuth, upload.single("image"), addStudent);

router.get("/get", checkAuth, getAllStudents);

router.get("/check-student/:courseId", checkAuth, getStudentIntoCourse);

router.get("/get/:studentId", checkAuth, getStudentById);

router.get("/getLatest", checkAuth, getLatestStudents);

router.delete("/delete/:studentId", checkAuth, deleteStudent);

router.put(
  "/update/:studentId",
  checkAuth,
  upload.single("image"),
  updateStudent
);

export default router;
