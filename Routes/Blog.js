const express = require("express");
const blogModel = require("../models/blogSchema");
const userModel = require("../models/userModel");
const checkAuthToken = require("../middleware/checkAuthToken");
const router = express.Router();

router.use(checkAuthToken);

async function checkBlogAuth(req, res, next) {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      res.status(404).send({ message: "Blog not found" });
    }
    if (blog.owner.toString() !== req.userId) {
      return res.status(404).send({ message: "Permission denied" });
    }
    req.blog = blog;
    next();
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

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

router.get("/:id", async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      res.status(404).send({ message: "Blog not found" });
    }
    res.send(blog);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.put("/:id", checkAuthToken, checkBlogAuth, async (req, res) => {
  try {
    const { title, description, image, paragraphs, category } = req.body;
    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        paragraphs,
        category,
      },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    res.status(201).send({ message: "Blog updated", updatedBlog });
  } catch (error) {
    res.status(404).send({ message: message.error });
  }
});

router.delete("/:id", checkAuthToken, checkBlogAuth, async (req, res) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.blogs.pull(req.params.id);
    await user.save();
    res.send({ message: "Blog deleted successfully", deletedBlog });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const search = req.body.search || "";
    const page = parseInt(req.body.page) || 1;
    const perPage = 2;
    const searchQuery = new RegExp(search, "i");
    const totalBlogs = await blogModel.countDocuments({ title: searchQuery });
    const totalPages = Math.ceil(totalBlogs / perPage);
    if (page < 1 || page > totalPages) {
      return res.status(400).send({ message: "Invalid page number" });
    }
    const skip = (page - 1) * perPage;
    const blogs = await blogModel
      .find({ title: searchQuery })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);
    res.send({ blogs, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
module.exports = router;
