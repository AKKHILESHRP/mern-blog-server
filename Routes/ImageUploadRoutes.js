const express = require("express");
const router = express.Router();
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/uploadimage", upload.single("myimage"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: "No image uploaded" });
  }
  sharp(file.buffer).resize({ width: 800}).toBuffer(async(err, data, info) => {
    if(err) {
      console.log("Image processing failed", err);
      return res.status(500).send({ message: "Image processing failed" });
    }
    cloudinary.uploader.upload_stream({ resource_type: "auto"}, async(err, result) => {
      if(err) {
        return res.status(500).send({ message: "Error uploading image to cloudinary", err });
      }
      res.send({ message: "Image uploaded successfully", imageUrl: result.url });
    }).end(data);
  })
});

module.exports = router;
