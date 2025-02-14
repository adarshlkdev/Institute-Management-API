import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import batchRoutes from "./routes/batch.routes.js";
import feeRoutes from "./routes/fee.routes.js";
import studentRoutes from "./routes/student.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use("/api/v1/batch", batchRoutes);
app.use("/api/v1/fee", feeRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/user", userRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Page not found" });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
  connectDB();
});
