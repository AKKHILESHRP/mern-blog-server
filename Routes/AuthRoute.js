const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const errorHandler = require("../middleware/errorMiddleware");
require("dotenv").config();

const transpoter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser)
      res.status(409).send({ message: "E-Mail already exists" });
    const newUser = new userModel({ name, email, password });
    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
