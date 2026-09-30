import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export const userCreate = async (req, res) => {
  const { fullName, email, password, role, contact } = req.body;

  if (
    !fullName.trim() ||
    !email.trim() ||
    !password.trim() 
  ) {
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // const response = isEmailExist.toObject();
    // delete response.password;

    // response.token = token;

    return res.status(200).json({
      success: true,
      message: "login successfull",
      data:{
        _id:isEmailExist._id,
        fullName:isEmailExist.fullName,
        email:isEmailExist.email,
        role:isEmailExist.role
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const logout = async (req,res) => {
  try {
    res.clearCookie("token");
    res.json({
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).json({success:false,message:err.message})
  }
};

export const profile=async(req,res)=>{
          const id =req.user._id

          try{
            const user =await User.findById(id).select("-password")
            res.status(200).json({success:true,data:user})

          }
          catch(err){
             return res.status(500).json({
                success: false,
                message: err.message,
              });
          }

}