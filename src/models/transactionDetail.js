const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionDetail = new Schema({
     transaction: {type: Schema.Types.ObjectId, required: true},
     product: {type: Schema.Types.ObjectId, required: true},
     quantity: {type: Number, required: true},
});

module.exports = mongoose.model('TransactionDetail', TransactionDetail);