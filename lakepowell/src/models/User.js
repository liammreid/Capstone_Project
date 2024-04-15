const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
});

// Pre-save hook for setting user password
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);