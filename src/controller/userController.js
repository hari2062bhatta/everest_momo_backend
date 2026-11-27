import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import transporter from "../services/nodemailer.js"
dotenv.config();
export const userCreate = async (req, res) => {
  const { fullName, email, password, role, contact } = req.body;

  if (!fullName.trim() || !email.trim() || !password.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "invalid user input " });
  }

  let isExist = await User.findOne({
    email,
  });

  if (isExist) {
    return res
      .status(409)
      .json({ success: false, message: "user already exist" });
  }
  try {
    let hashPassword = await bcrypt.hashSync(password, 10);

    let response = await User.create({
      fullName,
      email,
      password: hashPassword,
      role,
      contact,
    });
    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: response,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const userView = async (req, res) => {
  try {
    let response = await User.find();
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const isEmailExist = await User.findOne({ email });

    if (!isEmailExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      isEmailExist.password,
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        _id: isEmailExist._id,
        role: isEmailExist.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    const refresh_token = jwt.sign(
      {
        _id: isEmailExist._id,
        role: isEmailExist.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "login successfull",
      data: {
        _id: isEmailExist._id,
        fullName: isEmailExist.fullName,
        email: isEmailExist.email,
        role: isEmailExist.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refresh_token")
    res.json({
      message: "Logout successful",
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const profile = async (req, res) => {
  const id = req.user._id;

  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: true, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.findByIdAndUpdate(id, req.body);
    res
      .status(200)
      .json({ success: true, message: "user update successfully" });
  } catch (err) {
    res.status(500).json({ success: true, message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  try {
    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET
    );

    const accessToken = jwt.sign(
      { _id: decoded._id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure:false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired. Please login again.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link will be sent.",
      });
    }

    const secret = process.env.RESET_TOKEN;

    if (!secret) {
      throw new Error("Reset token secret is missing");
    }

    const reset_token = jwt.sign(
      {
        id: user._id.toString(),
        purpose: "password-reset",
      },
      secret,
      { expiresIn: "5m" }
    );

    const link =
      `http://localhost:5173/resetpassword/${reset_token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      text: `Click this link to reset your password: ${link}`,
    });

    return res.status(200).json({
      success: true,
      message: "If the email exists, a reset link will be sent.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;


  if (
    typeof token !== "string" ||
    typeof newPassword !== "string" ||
    !newPassword.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Token or new password is missing",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.RESET_TOKEN
    );

  
    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      decoded.purpose !== "password-reset"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // 4. Find the user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 5. Hash the new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // 6. Update the password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "New password set successfully",
    });

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
