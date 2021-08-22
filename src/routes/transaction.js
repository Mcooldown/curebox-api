const express = require('express');
const {body} = require('express-validator');
const transactionController = require('../controllers/transaction');

const router = express.Router();

const validateInput = () => {
     return [
          body('address').notEmpty().withMessage("Specific address must be filled"),
          body('province').notEmpty().withMessage("Province must be filled"),
          body('cityDistrict').notEmpty().withMessage("City/District must be filled"),
          body('subDistrict').notEmpty().withMessage("Sub-district must be filled"),
          body('urbanVillage').notEmpty().withMessage("Urban Village must be filled"),
          body('postalCode').notEmpty().withMessage("Postal Code must be filled"),
          body('postalCode').isNumeric().withMessage("Postal Code must be number"),
          body('receiverName').notEmpty().withMessage("Receiver Name must be filled"),
          body('receiverPhoneNumber').notEmpty().withMessage("Receiver Phone Number must be filled"),
          body('receiverPhoneNumber').isNumeric().withMessage("Receiver Phone Number must be number"),
     ];
};

router.post('/', validateInput(), transactionController.storeNewTransaction);
router.get('/:userId', transactionController.getAllTransactions);
router.get('/detail/:transactionId', transactionController.getTransactionDetail);
router.delete('/:transactionId', transactionController.removeTransaction);

module.exports = router;