const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");

// Define route handlers
router.get("/", homeController.getHome);

router.get("/about", homeController.getAbout);

module.exports = router;
