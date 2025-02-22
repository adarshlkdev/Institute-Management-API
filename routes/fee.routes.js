import express from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import { addFee, paymentHistory } from "../controllers/Fee.controller.js";
import { getFeeIntoCourse } from "../controllers/Fee.controller.js";

const router = express.Router();

router.post("/add", checkAuth, addFee);

router.get("/history", checkAuth, paymentHistory);

router.get("/getFeeIntoCourse", checkAuth, getFeeIntoCourse);

export default router;
