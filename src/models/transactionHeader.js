const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionHeader = new Schema({
     user: {type: Schema.Types.ObjectId, required:true, ref: 'User'},
     sendAddress: {type: String, required: true},
     receiverName: {type: String, required: true},
     receiverPhoneNumber: {type: String, required: true},
     notes: {type: String, required: false},
},{
     timestamps: true,
});

module.exports = mongoose.model('TransactionHeader', TransactionHeader);