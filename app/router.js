const express = require('express');

// on importe nos controllers
const mainController = require('./controllers/mainController');
//const cartController = require('./controllers/cartController');
const cartController = require('./controllers/cartControllerAlt');


const router = express.Router();

// page d'accueil
router.get('/', mainController.homePage);

// page article
router.get('/article/:id', mainController.articlePage);

// page panier
router.get('/cart', cartController.cartPage);
router.get('/cart/add/:id', cartController.addToCart );
router.get('/cart/delete/:id', cartController.deleteFromCart );


// on exporte le router 
module.exports = router;