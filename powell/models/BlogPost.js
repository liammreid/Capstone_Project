const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {type: String, required: true},
  titleSlug: {type: String, required: true, unique: true},
  imageURL: {type: String},
  summary: {type: String, required: true},
  content: {type: String, required: true},
});
;

blogPostSchema.pre('save', function (next) {
  this.titleSlug = slugify(this.title, {
    lower: true,
    strict: true
  });
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
