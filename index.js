const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/AuthRoute");
const blogRoutes = require("./Routes/Blog");
const cookieParser = require("cookie-parser");
require("dotenv").config

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/blog", blogRoutes);

mongoose.connect("mongodb://localhost:27017/Mern-Blog")
.then(() => console.log("Database connected"))
.catch(err => console.error(err));

app.listen(8000, () => console.log("Server is up and running"));