const express = require('express')
const {body} = require('express-validator');

const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');

const validateRegister = () => {
     return [
          body('name').notEmpty().withMessage('Name must be filled'),
          body('gender').notEmpty().withMessage('Gender must be filled'),
          body('address').notEmpty().withMessage('Address must be filled'),
          body('dateOfBirth').notEmpty().withMessage('Date of Birth must be filled'),
          body('dateOfBirth').isDate('YYYY-MM-DD').withMessage('Date of Birth must be match YYYY-MM-DD'),
          body('phoneNumber').notEmpty().withMessage('Phone Number must be filled'),
          body('phoneNumber').isNumeric().withMessage('Phone Number must be filled'),
          body('email').notEmpty().withMessage('Email must be filled'),
          body('email').isEmail().withMessage('Email must be valid'),
          body('email').custom(value => {
               return User.findOne({email: value})
               .then(user => {
                    if(user) return Promise.reject('Email already in use');
                    else return Promise.resolve();
               })
          }),
          body('password').notEmpty().withMessage('Password must be filled'),
          body('passwordConfirm').notEmpty().withMessage('Password must be filled'),
          body('passwordConfirm').custom((value, {req}) => {
               if(value != req.body.password)return Promise.reject('Password confirmation do not match');
               else return Promise.resolve();
          }),
     ]
};

const validateLogin = () => {
     return [
          body('email').notEmpty().withMessage('Email must be filled'),
          body('password').notEmpty().withMessage('Password must be filled'),
     ]
};

router.get('/user/:userId', authController.getUserById);
router.post('/register', validateRegister(), authController.register);
router.post('/login', validateLogin(), authController.login);

module.exports = router;