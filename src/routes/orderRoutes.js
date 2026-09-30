import express from "express"
import authMiddleware from "../middlewares/authMiddlewares.js"
import isAdmin from "../middlewares/isAdmin.js"
import {orderCreate,updateStatus,viewOrder,deleteOrder,viewAllOrder,updateDelivary} from "../controller/orderController.js"
const orderRouter =express.Router();

orderRouter.post("/create",authMiddleware, orderCreate)
orderRouter.put("/updatestatus/:id",authMiddleware, updateStatus)
orderRouter.get("/view",authMiddleware, viewOrder)
orderRouter.delete("/delete",authMiddleware, deleteOrder)
orderRouter.get("/viewall",authMiddleware,isAdmin ,viewAllOrder)
orderRouter.put("/updatedelivary/:id",authMiddleware,isAdmin,updateDelivary)

export default orderRouter ;

