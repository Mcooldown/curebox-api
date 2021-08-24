const {validationResult} = require('express-validator');
const TransactionHeader = require('../models/transactionHeader');
const TransactionDetail = require('../models/transactionDetail');
const Cart = require('../models/cart');

exports.storeNewTransaction = (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()){
          res.status(400).send({message: "Invalid input", data: errors.array()});
     }

     const newTransactionHeader = new TransactionHeader({
          user: req.body.userId,
          sendAddress: {
               address: req.body.address,
               province: req.body.province,
               cityDistrict: req.body.cityDistrict,
               subDistrict: req.body.subDistrict,
               urbanVillage: req.body.urbanVillage,
               postalCode: req.body.postalCode,
          },
          receiverName: req.body.receiverName,
          receiverPhoneNumber: req.body.receiverPhoneNumber,
          notes: req.body.notes,
          amount: req.body.amount,
     });

     newTransactionHeader.save()
     .then(header => {
          Cart.find({user: req.body.userId})
          .then(cartProducts => {
               cartProducts.map(cartProduct => {
                    const newTransactionDetail = new TransactionDetail({
                         transaction: header._id,
                         product: cartProduct.product,
                         quantity: cartProduct.quantity,
                    });
     
                    newTransactionDetail.save();
               });
          })
          return Cart.deleteMany({user: req.body.userId});
     })
     .then(result => {
          res.status(200).json({message: "New Transaction Created", data: result});
     })
     .catch(err => {
          next(err);
     })
}

exports.getAllTransactions = (req, res, next) => {

     TransactionHeader.find({user: req.params.userId})
     .then(result => {
          res.status(200).json({message: "All transaction fetched", data:result});
     })
     .catch(err => {
          next(err);
     })
}

exports.getTransactionDetail = (req, res, next) => {
     
     TransactionDetail.find({transaction: req.params.transactionId})
     .populate('transaction')
     .populate({
          path: 'product',
          populate : {
               path: 'seller',
          }
     })
     .then(result => {
          if(!result) res.status(404).json({message: "Transaction Detail not Found"});
          
          res.status(200).json({message: "Transaction Detail fetched", data: result});
     })
     .catch(err => {
          next(err);
     })
}

exports.removeTransaction = (req, res, next) => {

     TransactionHeader.findById(req.params.transactionId)
     .then(transaction => {
          if(!transaction) res.status(404).json({message: "Transaction not found"});

          return TransactionHeader.findByIdAndRemove(req.params.transactionId)
     })
     .then(header => {
          return TransactionDetail.deleteMany({transaction: req.params.transactionId});
     })
     .then(result => {
          res.status(200).json({message: "Transaction data deleted", data: result});
     })
     .catch(err => {
          next(err);
     })
}