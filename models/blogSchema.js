const mongoose = require("mongoose");

const paragraphSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const blogSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    paragraphs: { type: [paragraphSchema], default: [] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blogs", blogSchema);

module.exports = blogModel;