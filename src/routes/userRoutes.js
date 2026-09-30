import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js"
import {
  userCreate,
  userView,
  login,
  logout,
  profile,
} from "../controller/userController.js";
const userRouter = express.Router();

userRouter.post("/create", userCreate);
userRouter.get("/view", userView);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/profile",authMiddleware, profile);
export default userRouter;
