const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema({
     name: {type: String, required: true },
     description: { type: String, required: false},
     price: {type: Number, required: true},
     rating: {type: Number, required:true, default: 0},
     productPhoto: {type: String, required: true},
     seller: {type: Schema.Types.ObjectId, required: true},
},{
     timestamps: true,
});

module.exports = mongoose.model('Product', Product);