const {validationResult} = require('express-validator');
const Article = require('../models/article');
const { cloudinary } = require('../../config/cloudinary');

exports.storeArticle = (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()){
          const err = new Error("Value invalid");
          err.errorStatus = 400;
          throw err;
     }

     const uploadImagePromise = new Promise (async(resolve, reject) => {
          try{
               const uploadedResponse = await cloudinary.uploader.upload(req.body.articlePhoto, {
                    upload_preset: 'curebox',
               });
               resolve(uploadedResponse.secure_url);
          }catch(err){
              reject(err);
          }
     });

     uploadImagePromise
     .then((urlResult) => {
         const createArticle = new Article({
               title: req.body.title,
               content: req.body.content,
               articlePhoto: urlResult,
               user: req.body.userId,
          })
          
          createArticle.save()
          .then(result => {
               res.status(201).json({
                    message: 'New Article Created',
                    data: result
               });
          })
          .catch(err => {
               next(err);
          })
     } , (err) => console.log(err) );
}

exports.getAllArticles = (req, res, next) => {

     const perPage = req.query.perPage || 4;
     const currentPage = req.query.currentPage || 1;

     Article.find().countDocuments()
     .then(count => {
          totalData = count;

          return Article.find()
          .populate('user')
          .skip((parseInt(currentPage)-1)*parseInt(perPage))
          .limit(parseInt(perPage));
     })
     .then(result =>{
          res.status(200).json({
               message: "All Articles Fetched",
               data: result,
               total_data: totalData,
               current_page: currentPage,
               per_page: perPage, 
          });
     })
     .catch(err => {
          next(err);
     });
}

exports.getUserArticles = (req, res, next) => {

     const perPage = req.query.perPage || 4;
     const currentPage = req.query.currentPage || 1;

     Article.find({user: req.params.userId}).countDocuments()
     .then(count => {
          totalData = count;

          return Article.find({user: req.params.userId})
          .populate('user')
          .skip((parseInt(currentPage)-1)*parseInt(perPage))
          .limit(parseInt(perPage));
     })
     .then(result =>{
          res.status(200).json({
               message: "All Articles Fetched",
               data: result,
               total_data: totalData,
               current_page: currentPage,
               per_page: perPage, 
          });
     })
     .catch(err => {
          next(err);
     });
}

exports.getArticleDetail = (req, res, next) => {
     
     Article.findById(req.params.articleId)
     .populate('user')
     .then(result => {

          if(!result){
               const error = new Error("Article not found");
               error.errorStatus = 404;
               throw error;
          }else{
               res.status(200).json({
                    message: "Article found and fetched",
                    data: result,
               });
          }
     })
     .catch(err =>{
          next(err);
     })
}

exports.updateArticle = (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()){
          const err = new Error("Value invalid");
          err.errorStatus = 400;
          throw err;
     }

     const uploadImagePromise = new Promise (async(resolve, reject) => {
          try{
               const uploadedResponse = await cloudinary.uploader.upload(req.body.articlePhoto, {
                    upload_preset: 'curebox',
               });
               resolve(uploadedResponse.secure_url);
          }catch(err){
              resolve(500);
          }
     });

      uploadImagePromise
     .then((urlResult) => {
          const newImage = urlResult;
          const articleId = req.params.articleId;

          Article.findById(articleId)
          .then(article =>{
               if(!article){
                    const err = new Error("Article not found");
                    err.errorStatus = 404;
                    throw err;
               }else{
                    article.title = req.body.title;
                    article.content = req.body.content;
                    article.articlePhoto = newImage !== 500 ? newImage : article.articlePhoto;
                    return article.save();
               }
          })
          .then(result => {
               res.status(200).json({
                    message: "Article updated",
                    data: result,
               });
          })
          .catch(err => {
               next(err);
          })

     }, null);
}

exports.deleteArticle = (req, res, next) => {
     
     const articleId = req.params.articleId;

     Article.findById(articleId)
     .then(article => {
          if(!article){
               const error = new Error("Article not found");
               error.errorStatus = 404;
               throw err;
          }else{
               return Article.findByIdAndRemove(articleId);
          }
     })
     .then(result => {
          res.status(200).json({
               message: "Article deleted",
               data: result,
          });
     })
     .catch(err => {
          next(err);
     })
}