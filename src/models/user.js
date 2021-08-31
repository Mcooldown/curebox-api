const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
     name: {type: String, required: true},
     gender: {type: String, required: true},
     address: {type: String, required: true},
     dateOfBirth: {type: String, required: true},
     phoneNumber: {type: String, required:true},
     profilePhoto: {type: String, required: true},
     email: {type:String, required:true},
     password: {type: String, required: true},
},{
     timestamps: true,
});

module.exports = mongoose.model('User', User);