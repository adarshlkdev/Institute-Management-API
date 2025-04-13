import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import courseRoutes from "./routes/course.routes.js";
import feeRoutes from "./routes/fee.routes.js";
import studentRoutes from "./routes/student.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/fee", feeRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/auth", userRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Page not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
