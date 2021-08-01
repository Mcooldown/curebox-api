const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cart = new Schema({
     user: {type: Schema.Types.ObjectId, required:true, ref:'User'},
     product: {type: Schema.Types.ObjectId, required:true, ref: 'Product'},
     quantity: {type: Number, required:true},
},{
     timestamps: true,
});

module.exports = mongoose.model('Cart', Cart);