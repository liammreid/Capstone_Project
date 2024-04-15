const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

// Place specific routes before the general parameterized ones
router.get("/", blogController.getBlogs);
router.get("/new-post", blogController.getNewPost); // Move this before `/:titleSlug`
router.get("/:titleSlug", blogController.getSingleBlog);
router.post("/new-post", blogController.postNewBlog);

module.exports = router;


module.exports = router;