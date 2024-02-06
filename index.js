const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/AuthRoute");
const blog = require("./Routes/Blog");
const blogCategory = require("./Routes/BlogCategories");
const imageUploadRoutes = require("./Routes/ImageUploadRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/blog", blog);
app.use("/blog-category", blogCategory);
app.use("/image", imageUploadRoutes);

mongoose.connect("mongodb://localhost:27017/Mern-Blog")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

app.listen(8000, () => console.log("Server is up and running"));
