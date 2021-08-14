const express = require('express');
const {body} = require('express-validator');
// const upload = require('../../config/multer/product')

const router = express.Router();
const productController = require('../controllers/product');

const validateInput = () => {
     return [
     body('name').not().isEmpty().withMessage('Product name must be filled'),
     body('price').not().isEmpty().withMessage('Product price must be filled'),
     body('price').isInt().withMessage('Product price must be number'),
     ];
}

router.post('/', validateInput() , productController.storeProduct);
router.get('/', productController.getAllProducts);
router.get('/store/:sellerId', productController.getProductsBySeller);
router.get('/:productId', productController.getProductById);
router.put('/:productId', validateInput(), productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);


module.exports = router;