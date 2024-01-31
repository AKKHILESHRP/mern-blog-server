const express = require("express");
const blogModel = require("../models/blogSchema");
const checkAuthToken = require("../middleware/checkAuthToken");
const router = express.Router();

router.get("/test", checkAuthToken, (req, res) => {
  res.send({ message: "hello from blog" });
});

module.exports = router;
