import mongoose from "mongoose"


const productSchema=mongoose.Schema({
   
    p_name:{
        type:String,
        required:true

    },
    p_price:{
        type:Number,
        required:true
        
    },
    p_img:{
        type:String,
    },
    p_rating:{
    type:Number,        
        required:true
    },
    p_description:{
        type:String,
        required:true
    },
    p_category:{
        type:String,
        emum:["veg","chicken","buff"]
    }
})

/** @type {mongoose.Model} */
const Product=mongoose.model("Product",productSchema)

export default Product;