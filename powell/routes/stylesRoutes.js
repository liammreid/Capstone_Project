const express = require("express");
const router = express.Router();

const stylesController = require("../controllers/stylesController");


router.get("/", stylesController.getStyles);
router.get("/new-style", stylesController.getNewStyle);
router.post("/new-style", stylesController.postNewStyle);
router.get("/:titleSlug", stylesController.getSingleStyle);


module.exports = router;
