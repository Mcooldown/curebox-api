const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema({
     name: {type: String, required: true },
     description: { type: String, required: false},
     price: {type: Number, required: true},
     rating: {type: Number, required:true, default: 0},
     product_photo: {type: String, required: true}
},{
     timestamps: true,
});

module.exports = mongoose.model('Product', Product);