const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    blogs: { type: Array, default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      user.password = await bcrypt.hash(user.password, 8);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
