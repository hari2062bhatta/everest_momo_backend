import mongoose from "mongoose"

const UserSchema =mongoose.Schema({
    
            fullName:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true,
                unique:true
            },
            password:{
                type:String,
                required:true
            },
            role:{
                type:String,
                enum:["user","admin"],
                default:"user"
            },
            contact:{
                type:Number
            }

})
/** @type {mongoose.Model} */

const User=mongoose.model('User',UserSchema)


export default User;
