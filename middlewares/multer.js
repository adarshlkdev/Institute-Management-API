import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import cloudinary from "../config/cloudinary.js";

// Multer configuration with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "institute-portal",
    format: async (req, file) =>
      ["png", "jpg", "jpeg"].includes(file.mimetype.split("/")[1])
        ? "jpg"
        : "png",
    public_id: (req, file) => Date.now() + path.extname(file.originalname),
  },
});

const upload = multer({ storage });

export default upload;
