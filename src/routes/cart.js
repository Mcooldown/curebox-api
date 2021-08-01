const express = require('express');
const {body} = require('express-validator');
const Product = require('../models/product');
const User = require('../models/user');
const cartController = require('../controllers/cart');

const router = express.Router();

const validateAddToCart = () => {
     return [
          body('userId').not().isEmpty().withMessage("User Id required"),
          body('productId').not().isEmpty().withMessage("Product Id required"),
          body('quantity').not().isEmpty().withMessage("Quantity must not empty"),
          body('quantity').isInt({min: 1}).withMessage("Quantity minimum 1"),
     ]
}

const validateQuantity = () => {
     return [
          body('quantity').not().isEmpty().withMessage("Quantity must not empty"),
          body('quantity').isInt({min: 1}).withMessage("Quantity minimum 1"),
     ]
}

router.post('/', validateAddToCart(), cartController.addProductToCart);
router.get('/:userId', cartController.getAllCartProducts);
router.put('/:cartProductId', validateQuantity(), cartController.changeCartProductQuantity);
router.delete('/:cartProductId', cartController.removeCartProduct);

module.exports = router;