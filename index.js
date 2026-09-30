import express from "express"
import dotenv from "dotenv"
import connection from "./src/config/database.js"
import productRouter from "./src/routes/productRoutes.js"
import userRouter from "./src/routes/userRoutes.js"
import CartRouter from "./src/routes/CartRoutes.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import orderRouter from "./src/routes/orderRoutes.js"
dotenv.config()

const app=express()
app.use(express.json())
app.use(cors(
    {
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(cookieParser())

// app.use("/image",express.static("uploads/"))
app.use("/uploads", express.static("uploads"));
app.use("/api/product",productRouter)
app.use("/api/user",userRouter)
app.use("/api/cart",CartRouter)
app.use("/api/order",orderRouter)
app.get('/',(req,res)=>{
    res.send("This Is home page ")
})
let port=process.env.PORT

app.listen(port ||5000,async()=>{
    await connection()
    console.log(`server has started at port ${port}`)
})