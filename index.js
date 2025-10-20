// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");

import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Image from "./models/file.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer disk storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const newImage = new Image({
      name: req.file.originalname,
      path: req.file.filename,
    });

    await newImage.save();

    res.status(201).json({
      message: "✅ Image uploaded successfully!",
      image: newImage,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "❌ Server error during upload" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ message: "❌ Failed to fetch images" });
  }
});

const PORT = process.env.PORT || 5001;
await connectDB();
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
