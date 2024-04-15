const mongoose = require('mongoose');
const slugify = require('slugify');


const powellStyleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleSlug: {
    type: String,
    required: true,
    unique: true
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /\.(jpg|png)$/.test(value);
      },
      message: 'Image URL must end with .jpg or .png'
    }
  },
  description: {
    type: String,
    required: true
  },
});


// Set the slug field based on the title
powellStyleSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true, remove: /[*+~.()'"!:@]/g });
  next();
});

const Style = mongoose.model('Style', powellStyleSchema);

module.exports = Style;