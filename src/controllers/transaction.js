const {validationResult} = require('express-validator');
const TransactionHeader = require('../models/transactionHeader');
const TransactionDetail = require('../models/transactionDetail');
const Cart = require('../models/cart');

exports.storeNewTransaction = async (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()){
          res.status(400).send({message: "Invalid input", data: errors.array()});
     }

     const newTransactionHeader = new TransactionHeader(req.body);

     newTransactionHeader.save()
     .then(header => {
          const cartProducts = await Cart.find({user: header.user});

          cartProducts.map(cartProduct => {
               
          });
     }) 
     .catch(err => {
          next(err);
     })
}