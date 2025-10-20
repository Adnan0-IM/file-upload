// const mongoose = require("mongoose");
import mongoose from "mongoose";
// local database connection string
const MONGO_URI = "mongodb://localhost:27017/fileUpload";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`database connected to ${connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    process.exit(1);
  }
};
