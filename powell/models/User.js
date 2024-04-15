const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  username: { type: String, required: true }, // Store username with each comment
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new Schema({
  username: { 
    type: String,
  required: true
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: { 
    type: Boolean, 
    default: false },
  password: {
    type: String,
    required: true,
  },
  favoriteStyles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Style' }],
  comments: [commentSchema],
});

// Pre-save hook for setting user password
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);