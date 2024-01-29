const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/AuthRoute");
const userModel = require("./models/userModel");
require("dotenv").config

app.use(express.json());
app.use(cors());
app.use("/", authRoutes);

mongoose.connect("mongodb://localhost:27017/Mern-Blog")
.then(() => console.log("Database connected"))
.catch(err => console.error(err));

app.listen(8000, () => console.log("Server is up and running"));