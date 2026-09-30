import express from "express";
import authMiddlewares from "../middlewares/authMiddlewares.js"
import {
  productCreate,
  productView,
  productDelete,
  productUpdate,
  productFilter,
} from "../controller/productController.js";
import upload from "../config/multer.js";
const productRouter = express.Router();

productRouter.post("/create", upload.single("image"), productCreate);
productRouter.get("/view", productView);
productRouter.delete("/delete/:id", productDelete);
productRouter.put("/update/:id", productUpdate);
productRouter.get("/filter",productFilter)

export default productRouter;
