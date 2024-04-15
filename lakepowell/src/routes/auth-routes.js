const router = require('express').Router();
const authController = require('../controllers/auth-controller');

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

router.post('/signup', authController.postSignup);

router.post('/login', authController.findUser, authController.processLogin);

router.get('/logout', authController.getLogout);

router.get('/favorite-styles/add/:styleId', authController.addFavoriteStyle);

router.get('/favorite-styles', authController.getFavoriteStyles);

router.get('/users', authController.getAdminUsers);

router.post('/users', authController.updateAdminUsers);

module.exports = router;