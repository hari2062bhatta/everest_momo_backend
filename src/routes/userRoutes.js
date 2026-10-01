import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js"
import isAdmin from "../middlewares/isAdmin.js"
import {
  userCreate,
  userView,
  login,
  logout,
  profile,
  deleteUser,
  updateUser,
  refreshToken
} from "../controller/userController.js";
const userRouter = express.Router();

userRouter.post("/create", userCreate);
userRouter.get("/view", userView);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/profile",authMiddleware, profile);
userRouter.delete("/deleteuser/:id",authMiddleware,isAdmin,deleteUser)
userRouter.put("/updateuser/:id",authMiddleware,isAdmin,updateUser)
userRouter.post("/refreshtoken",refreshToken)
export default userRouter;
