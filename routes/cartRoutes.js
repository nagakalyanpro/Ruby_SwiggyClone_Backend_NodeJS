const express = require('express')
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/:firmId/:userId/add-to-cart', cartController.addToCart);

module.exports = router;