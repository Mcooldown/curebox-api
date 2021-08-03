const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionDetail = new Schema({
     transaction: {type: Schema.Types.ObjectId, required: true, ref: 'Transaction'},
     product: {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
     quantity: {type: Number, required: true},
},{
     timestamps: true,
});

module.exports = mongoose.model('TransactionDetail', TransactionDetail);