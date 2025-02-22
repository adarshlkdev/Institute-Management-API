import express from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import upload from "../middlewares/multer.js";
import {
  addCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  getLatestCourses,
} from "../controllers/Course.controller.js";

const router = express.Router();

router.post("/add", checkAuth, upload.single("image"), addCourse);

router.get("/get", checkAuth, getCourses);

router.get("/get/:courseId", checkAuth, getCourse);

router.get("/getLatest", checkAuth, getLatestCourses);

router.delete("/delete/:courseId", checkAuth, deleteCourse);

router.put(
  "/update/:courseId",
  checkAuth,
  upload.single("image"),
  updateCourse
);

export default router;
