const express = require('express');
const router = express.Router();
const BlogPost = require("../models/BlogPost");
const slugify = require('slugify');

// Get all blog posts
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await BlogPost.find().sort({ postDate: "desc" });
    res.render("blog", { pageTitle: "Blog", blogs, path: req.baseUrl });
  } catch (e) {
    console.error("Error fetching blogs:", e);
    res.status(500).render('error', { error: e });
  }
};

// Get a single blog post
exports.getSingleBlog = async (req, res, next) => {
  const { titleSlug } = req.params;
  try {
    const blog = await BlogPost.findOne({ titleSlug: titleSlug.toLowerCase() });
    if (!blog) {
      res.status(404).send("Blog not found");
      return;
    }
    res.render("blog-single-post", {
      pageTitle: blog.title,
      blog,
      path: req.baseUrl,
    });
  } catch (e) {
    console.error("Error fetching the blog post:", e);
    res.status(500).send("An error occurred");
  }
};

// Render the form for creating a new blog post
// Example function within blogController.js
exports.getNewPost = (req, res) => {
  res.render('new-post', {
      pageTitle: 'Create New Post',
      path: '/new-post',
      errorMessage: null
  });
};


// Handle the submission of a new blog post
exports.postNewBlog = async (req, res, next) => {
  const { title, summary, content } = req.body;
  if (!req.files || !title || !summary || !content) {
    return res.status(400).render('new-post', {
      pageTitle: "New Post",
      errorMessage: 'All fields are required, including the image.',
      path: req.baseUrl,
      oldInput: { title, summary, content },
      validationErrors: []
    });
  }

  const image = req.files.image;
  if (!image.mimetype.startsWith('image')) {
    return res.status(400).render('new-post', {
      pageTitle: "New Post",
      errorMessage: 'Invalid file type. Only images are allowed.',
      path: req.baseUrl,
      oldInput: { title, summary, content },
      validationErrors: []
    });
  }

  const imageName = `${Date.now()}_${image.name}`;
  const imageURL = `images/${imageName}`;
  const titleSlug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });

  try {
    await image.mv(`public/images/${imageName}`);
    const newBlogPost = new BlogPost({
      title, titleSlug, imageURL, summary, content
    });
    await newBlogPost.save();
    res.redirect('/blog');
  } catch (err) {
    console.error('Error creating new blog post:', err);
    return res.status(500).send('Failed to create new post.');
  }
};
