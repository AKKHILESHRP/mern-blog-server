const mongoose = require("mongoose");

const paragraphSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const blogSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    paragraphs: { type: [paragraphSchema] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blogs", blogSchema);
module.exports = blogModel;
