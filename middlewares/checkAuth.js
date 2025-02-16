import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }
    // Attach the decoded token to the request object
    req.userData = decoded;
    // Pass control to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access.",
    });
  }
};
