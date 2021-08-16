const {validationResult} = require('express-validator');
const Product = require('../models/product');
const Cart = require('../models/cart');
const {cloudinary} = require('../../config/cloudinary');

exports.storeProduct = (req, res, next) => {
     
     // cek error
     const errors = validationResult(req);
     if(!errors.isEmpty()){
          const err = new Error('Invalid value');
          err.errorStatus = 400;
          err.data = errors.array();
          throw err;
     }


     const uploadImagePromise = new Promise (async(resolve, reject) => {
          try{
               const uploadedResponse = await cloudinary.uploader.upload(req.body.productPhoto, {
                    upload_preset: 'curebox',
               });
               console.log(uploadedResponse);
               resolve(uploadedResponse.url);
          }catch(err){
              reject(500);
          }
     });

     uploadImagePromise
     .then((urlResult) => {
          const createProduct = new Product({
               name: req.body.name,
               description: req.body.description,
               price: req.body.price,
               rating: 0,
               productPhoto: urlResult,
               seller: req.body.sellerId,
               isDeleted: false,
          });
          
          createProduct.save()
          .then(result => {
               res.status(201).json({
                    message: 'New Product Created',
                    data: result
               });
          })
          .catch(err => {
               next(err);
          })
     } , (err) => console.log(err) );
}

exports.getAllProducts = (req, res, next) => {

     const perPage = req.query.perPage || 10;
     const currentPage = req.query.currentPage || 1;

     Product.find({isDeleted: false}).countDocuments()
     .then(count => {
          totalData = count;
          return Product.find({isDeleted:false})
          .populate('seller')
          .skip((parseInt(currentPage)-1)*parseInt(perPage))
          .limit(parseInt(perPage));
     })
     .then(result => {
          res.status(200).json({
               message : "All Product Fetched",
               data: result,
               total_data: totalData,
               per_page: perPage,
               current_page: currentPage,
          });
     })
     .catch(err => {
          next(err);
     });
}

exports.getProductsBySeller = (req, res, next) => {

     const perPage = req.query.perPage || 10;
     const currentPage = req.query.currentPage || 1;

     Product.find({seller: req.params.sellerId, isDeleted: false}).countDocuments()
     .then(count => {
          totalData = count;
          return Product.find({seller: req.params.sellerId, isDeleted: false})
          .skip((parseInt(currentPage)-1)*parseInt(perPage))
          .limit(parseInt(perPage));
     })
     .then(result => {
          res.status(200).json({
               message : "All Product Fetched",
               data: result,
               total_data: totalData,
               per_page: perPage,
               current_page: currentPage,
          });
     })
     .catch(err => {
          next(err);
     });
}

exports.getProductById = (req, res, next) => {

     const productId = req.params.productId;

     Product.findById(productId)
     .populate('seller')
     .then(result => {
          if(!result) {
               const error = new Error("Product not found");
               error.errorStatus = 404;
               throw error;
          }else{
               res.status(200).json({
                    message: "Product fetched",
                    data: result,
               })
          }
     })
     .catch(err => {
          next(err);
     });
}

exports.updateProduct = (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()){
          const err = new Error('Invalid value');
          err.errorStatus = 400;
          err.data = errors.array();
          throw err;
     }

     const uploadImagePromise = new Promise (async(resolve, reject) => {
          try{
               const uploadedResponse = await cloudinary.uploader.upload(req.body.productPhoto, {
                    upload_preset: 'curebox',
               });
               console.log(uploadedResponse);
               resolve(uploadedResponse.url);
          }catch(err){
              resolve(500);
          }
     });

      uploadImagePromise
     .then((urlResult) => {
          const newImage = urlResult;
          const productId = req.params.productId;

          Product.findById(productId)
          .then(product =>{
               if(!product){
                    const err = new Error("Product not found");
                    err.errorStatus = 404;
                    throw err;
               }else{
                    product.name = req.body.name;
                    product.description = req.body.description;
                    product.price = req.body.price;
                    product.productPhoto = newImage !== 500 ? newImage : product.productPhoto;
                    return product.save();
               }
          })
          .then(result => {
               res.status(200).json({
                    message: "Product updated",
                    data: result,
               });
          })
          .catch(err => {
               next(err);
          })

     }, null);

     
}

exports.deleteProduct = (req, res, next) => {

     const productId = req.params.productId;
     Product.findById(productId)
     .then(product => {
          if(!product){
               const err = new Error("Product not found");
               err.errorStatus = 404;
               throw err;
          }else{
               product.isDeleted = true;
               product.save();
               return Cart.deleteMany({product: product._id});
          }
     })
     .then(result => {
          res.status(200).json({
               message: "Product deleted",
               data: result,
          });
     })
     .catch(err =>{
          next(err);
     })

}