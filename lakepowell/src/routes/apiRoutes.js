const express = require("express");
const router = express.Router();

const stylesController = require('../controllers/stylesController');
const authController = require('../controllers/auth-controller');

const apiController = require('../controllers/api-controller');

router.post('/auth', authController.findUser, apiController.getToken);

router.use(apiController.verifyToken);

router.get('/styles', stylesController.getStyles, apiController.sendStylesJSON);

router.use(apiController.handleError);

module.exports = router;