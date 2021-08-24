const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionHeader = new Schema({
     user: {type: Schema.Types.ObjectId, required:true, ref: 'User'},
     sendAddress: {
          address: {type: String, required: true},
          province: {type: String, required: true},
          cityDistrict: {type: String, required: true},
          subDistrict: {type: String, required: true},
          urbanVillage: {type: String, required: true},
          postalCode: {type: String, required: true},
     },
     receiverName: {type: String, required: true},
     receiverPhoneNumber: {type: String, required: true},
     notes: {type: String, required: false},
     amount: {type: Number, required: true},
},{
     timestamps: true,
});

module.exports = mongoose.model('TransactionHeader', TransactionHeader);