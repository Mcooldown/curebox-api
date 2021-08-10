const {validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).send({error: "Invalid input", data: errors.array()});
     }
 
     const createUser = new User({
          name: req.body.name,
          gender: req.body.gender,
          address: req.body.address,
          dateOfBirth: req.body.dateOfBirth,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          password: null,
     });

     const salt = await bcrypt.genSalt(10);
     createUser.password = await bcrypt.hash(req.body.password, salt);

     createUser.save()
     .then(result => {
          res.status(200).json({
               message: "New User Registered",
               data: result,
          });
     })
     .catch(err => {
          next(err);
     });
}

exports.login = async (req, res, next) => {

     const body = req.body;
     const user = await User.findOne({email: body.email});

     if(user){
          const matchPassword = await bcrypt.compare(body.password, user.password);
          if(matchPassword) {
               res.status(200).json({message: "Login success", data: user});
          }else{
               res.status(400).json({message: "Invalid email or password"});
          }
     }else{
          res.status(400).json({message: "Invalid email or password"});
     }
}