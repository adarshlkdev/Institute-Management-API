import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/helper.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      imageUrl: req.file.path,
      imageId: req.file.filename,
    });

    await newUser.save();

    generateTokenAndSetCookie(res, newUser);

    const userResponse = await User.findById(newUser._id).select("-password");

    res.status(201).json({
      success: true,
      message: "User Registered successfully.",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email doesn't exists" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Password" });
    }
    generateTokenAndSetCookie(res, user);
    await user.save();

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};
