import multer from "multer";

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: "An unknown error occurred while uploading.",
    });
  }

  next();
};

export default multerErrorHandler;
