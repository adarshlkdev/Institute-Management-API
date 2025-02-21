import express from "express";
import upload from "../middlewares/multer.js";
import multerErrorHandler from "../middlewares/errorHandler.js";
import { signup, login, logout } from "../controllers/User.controller.js";

const router = express.Router();

router.post("/signup", upload.single("image"), multerErrorHandler, signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
