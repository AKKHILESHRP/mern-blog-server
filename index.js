const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Mern-Blog")
.then(() => console.log("Database connected"))
.catch(err => console.error(err));

app.listen(8000, () => console.log("Server is up and running"));