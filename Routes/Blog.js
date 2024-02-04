const express = require("express");
const blogModel = require("../models/blogSchema");
const userModel = require("../models/userModel");
const checkAuthToken = require("../middleware/checkAuthToken");
const router = express.Router();

router.use(checkAuthToken);

router.post("/", checkAuthToken, async (req, res) => {
  try {
    const { title, description, image, paragraphs, category } = req.body;
    const blog = new blogModel({
      title,
      description,
      image,
      paragraphs,
      category,
      owner: req.userId,
    });
    await blog.save();
    const user = await userModel.findById(req.userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    user.blogs.push(blog._id);
    await user.save();
    res.status(201).send({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
