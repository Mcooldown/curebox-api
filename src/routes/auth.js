const express = require('express')
const {body} = require('express-validator');

const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');

const validateRegister = () => {
     return [
          body('name').not().isEmpty().withMessage('Name must be filled'),
          body('gender').not().isEmpty().withMessage('Gender must be filled'),
          body('address').not().isEmpty().withMessage('Address must be filled'),
          body('date_of_birth').not().isEmpty().withMessage('Date of Birth must be filled'),
          body('date_of_birth').isDate('YYYY-MM-DD').withMessage('Date of Birth must be match YYYY-MM-DD'),
          body('phone_number').not().isEmpty().withMessage('Phone Number must be filled'),
          body('phone_number').isNumeric().withMessage('Phone Number must be filled'),
          body('email').not().isEmpty().withMessage('Email must be filled'),
          body('email').isEmail().withMessage('Email must be valid'),
          body('email').custom(value => {
               return User.findOne({email: value})
               .then(user => {
                    if(user) return Promise.reject('Email already in use');
                    else return Promise.resolve();
               })
          }),
          body('password').not().isEmpty().withMessage('Password must be filled'),
          body('password_confirm').not().isEmpty().withMessage('Password must be filled'),
          body('password_confirm').custom((value, {req}) => {
               if(value != req.body.password)return Promise.reject('Password confirmation do not match');
               else return Promise.resolve();
          }),
     ]
};

const validateLogin = () => {
     return [
          body('email').not().isEmpty().withMessage('Email must be filled'),
          body('password').not().isEmpty().withMessage('Password must be filled'),
     ]
};

router.post('/register', validateRegister(), authController.register);
router.post('/login', validateLogin(), authController.login);

module.exports = router;