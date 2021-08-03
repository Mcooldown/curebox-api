const {validationResult} = require('express-validator');
const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');

exports.addProductToCart = async (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()) res.status(400).json({message: "Invalid input", data: errors.array()});

     const existCartProduct = await Cart.findOne({user: req.body.userId, product: req.body.productId});

     if(existCartProduct){
          existCartProduct.quantity = existCartProduct.quantity + req.body.quantity;
          
          existCartProduct.save()
          .then(result => {
               res.status(200).json({message: "Product exist in cart. Quantity updated", data: result});
          })
          .catch(err => {
               next(err);
          });
     }else{
          const user = await User.findById(req.body.userId);
          if(!user) res.status(404).send({message: "User not found"});
          const product = await Product.findById(req.body.productId);
          if(!product) res.status(404).send({message: "Product not found"});
     
          const createCartProduct = new Cart({
               user: req.body.userId,
               product: req.body.productId,
               quantity: req.body.quantity,
          });
          
          createCartProduct.save()
          .then( result => {
               res.status(200).json({message: "New product added to cart", data: result});
          })
          .catch(err => {
               next(err);
          });
     }
}

exports.getAllCartProducts = (req, res, next) => {
     
     Cart.find({user: req.params.userId})
     .populate('product')
     .then(result => {
          res.status(200).json({message: "All Product on Cart fetched", data: result});
     })
     .catch(err => {
          next(err);
     })
}

exports.changeCartProductQuantity = (req, res, next) => {
     
     const errors = validationResult(req);
     if(!errors.isEmpty()) res.status(400).json({message: "Invalid input", data: errors.array()})

     Cart.findById(req.params.cartProductId)
     .then(cartProduct => {
          if(!cartProduct) res.status(404).json({message: "Cart Product not found"});
          
          cartProduct.quantity = req.body.quantity;
          return cartProduct.save();
     })
     .then(result => {
          res.status(200).json({message: "Cart Product updated", data: result});
     })
     .catch(err => {
          next(err);
     });
}

exports.removeCartProduct = (req, res, next) => {

     Cart.findById(req.params.cartProductId)
     .then(cartProduct => {
          if(!cartProduct) res.status(404).json({message: "Cart product not found"});

          return Cart.findByIdAndRemove(req.params.cartProductId);
     })
     .then(result => {
          res.status(200).json({message: "Cart product removed", data: result});
     })
     .catch(err => {
          next(err);
     })
}