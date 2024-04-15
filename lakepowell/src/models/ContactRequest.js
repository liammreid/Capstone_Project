const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateResponded: {
    type: Date,
  },
  response: {
    type: String,
  },
});

// Define virtual property for shortMessage
contactRequestSchema.virtual('shortMessage').get(function() {
  return `${this.message.split(/\s+/).slice(0, 10).join(" ")}...`;
});

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);

module.exports = ContactRequest;