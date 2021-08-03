const express = require('express');
const {body} = require('express-validator');
const transactionController = require('../controllers/transaction');

const router = express.Router();

const validateInput = () => {
     return [
          body('sendAddress').notEmpty().withMessage("Address to send must be filled"),
          body('receiverName').notEmpty().withMessage("Receiver name must be filled"),
          body('receiverPhoneNumber').notEmpty().withMessage("Receiver phone number must be filled"),
          body('receiverPhoneNumber').isNumeric().withMessage("Receiver phone number must numeric"),
          body('notes').notEmpty().withMessage("Notes must be filled"),
     ];
};

router.post('/', validateInput(), transactionController.storeNewTransaction);
router.get('/:userId', transactionController.getAllTransactions);
router.get('/detail/:transactionId', transactionController.getTransactionDetail);
router.delete('/:transactionId', transactionController.removeTransaction);

module.exports = router;