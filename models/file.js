import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", ImageSchema);

export default Image;
