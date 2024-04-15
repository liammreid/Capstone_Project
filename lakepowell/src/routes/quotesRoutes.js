const express = require("express");
const router = express.Router();

const quotesController = require("../controllers/quotesController");

router.get('/random-quote', quotesController.getRandomQuote);

module.exports = router;