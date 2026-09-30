import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connection = async () => {
  try {
    let response = await mongoose.connect(process.env.CONNECTION_URL);
    if (response) {
      console.log("database connected successfully");
    } else {
      console.log("some error while connecting database");
    }
  } catch (err) {
    console.log(err);
  }
};

export default connection;
