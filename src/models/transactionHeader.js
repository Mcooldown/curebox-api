const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionHeader = new Schema({
     user: {type: Schema.Types.ObjectId, required:true},
     send_address: {type: String, required: true},
     receiver_name: {type: String, required: true},
     receiver_phone_number: {type: String, required: true},
     notes: {type: String, required: true},
});

module.exports = mongoose.model('TransactionHeader', TransactionHeader);