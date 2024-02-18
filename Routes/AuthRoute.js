const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const errorHandler = require("../middleware/errorMiddleware");
const checkAuthToken = require("../middleware/checkAuthToken");
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

router.post("/otp", async (req, res, next) => {
  const { email } = req.body;
  const OTP = Math.floor(Math.random() * 1000000);
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification for blog application",
      text: `Your OTP verification is:${OTP}`,
    };
    transpoter.sendMail(mailOptions, async (err, info) => {
      if (!err) res.send({ message: "OTP Sent to your mail successfully" });
      else res.status(404).send({ message: "Error occured while sending OTP" });
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      res.status(400).send({ message: "Incorrect username or password" });
    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) res.status(400).send({ message: "Invalid credentials" });
    const authToken = jwt.sign({ userId: user._id }, process.env.AUTH_SECRET, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "40m",
      }
    );
    res.cookie("auth_token", authToken, { httpOnly: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true });
    res.send({ message: "Login successful", token1: authToken, token2: refreshToken });
  } catch (error) {
    next(error);
  }
});

router.get("/checklogin", checkAuthToken, async (req, res) => {
  res.send({ message: "User authenticated successfully" });
})

router.use(errorHandler);

module.exports = router;
