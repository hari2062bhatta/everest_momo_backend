
import express from "express"
import {addCart ,viewCart,incrementCart,decrementCart,removeCart,deleteAllCart} from "../controller/cartController.js"
import authMiddleware from "../middlewares/authMiddlewares.js"
const CartRouter=express.Router()


   CartRouter.post("/add",authMiddleware,addCart)
   CartRouter.get("/view",authMiddleware,viewCart)
   CartRouter.put("/increment/:id",authMiddleware,incrementCart)
   CartRouter.put("/decrement/:id",authMiddleware,decrementCart)
   CartRouter.delete("/remove/:id",authMiddleware,removeCart)
   CartRouter.delete("/removeall",authMiddleware,deleteAllCart)

export default CartRouter;


