import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const authMiddlewares = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "not authenticated" });
  }
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      req.user = decoded;
      next();
    } 
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      code :"ACCESS_TOKEN_EXPIRED",
    });
  }
};

export default authMiddlewares;
