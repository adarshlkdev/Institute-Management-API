import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${res.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
