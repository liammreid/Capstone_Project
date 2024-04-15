const mongoose = require('mongoose');
const Style = require('../../models/PowellStyle');
const BlogPost = require('../../models/BlogPost');
const ContactRequest = require('../../models/ContactRequest');
const powellData = require('./powellData.json');
const blogData = require('./blogData.json');
const User = require('../../models/user')

// Replace <username>, <password>, and <clustername> with your own Atlas credentials and cluster name
const uri = 'mongodb+srv://a02303144:Realsaltlake_2005@weather.y7vpqbr.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Atlas');
    return Promise.all([
      Style.deleteMany(),
      BlogPost.deleteMany(),
      User.deleteMany(),
    ]);
  })
  .then(() => {
    console.log('Deleted all documents');
    return Promise.all([
      Style.insertMany(powellData),
      BlogPost.insertMany(blogData),
      User.insertMany(userData)
    ]);
  })
  .then(() => {
    console.log('Data uploaded successfully');
    mongoose.connection.close();
  })
  .catch((error) => console.error(error));

