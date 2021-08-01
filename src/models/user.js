const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
     name: {type: String, required: true},
     gender: {type: String, required: true},
     address: {type: String, required: true},
     date_of_birth: {type: Date, required: true},
     phone_number: {type: String, required:true},
     email: {type:String, required:true},
     password: {type: String, required: true},
},{
     timestamps: true,
});

module.exports = mongoose.model('User', User);