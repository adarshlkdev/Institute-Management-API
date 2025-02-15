import multer from 'multer';

// Multer error-handling middleware
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    // An unknown error occurred when uploading
    return res.status(500).json({
      success: false,
      message: 'An unknown error occurred while uploading.',
    });
  }

  // If no error, pass control to the next middleware
  next();
};

export default multerErrorHandler;