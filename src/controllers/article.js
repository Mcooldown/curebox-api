const {validationResult} = require('express-validator');
const Article = require('../models/article');
const path = require('path');
const fs = require('fs');

exports.storeArticle = (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()){
          const error = new Error("Value invalid");
          error.errorStatus = 400;
          throw err;
     }

     if(!req.file){
          const error = new Error("Article photo must be uploaded or match required format");
          error.errorStatus = 422;
          throw err;
     }

     const createArticle = new Article({
          title: req.body.title,
          content: req.body.content,
          article_photo: req.file.path,
     })
     
     createArticle.save()
     .then(result =>{
          res.status(200).json({
               message: "New Article Stored",
               data: result,
          });
     })
     .catch(err =>{
          next(err);
     });
}

exports.getAllArticles = (req, res, next) => {

     const perPage = req.query.perPage || 4;
     const currentPage = req.query.currentPage || 1;

     Article.find().countDocuments()
     .then(count => {
          totalData = count;

          return Article.find()
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

exports.getArticleById = (req, res, next) => {
     
     Article.findById(req.params.articleId)
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

     if(!req.file){
          const error = new Error("Image must be uploaded or match required format");
          error.errorStatus = 422;
          throw error;
     }

     Article.findById(req.params.articleId)
     .then(article =>{
          if(!article){
               const error = new Error("Article not found");
               error.errorStatus = 404;
               throw error;
          }else {
               if(article.article_photo) removeImage(article.article_photo);
               article.title = req.body.title;
               article.content = req.body.content;
               article.article_photo = req.file.path;
          
               return article.save();
          }
     })
     .then(result => {
          res.status(200).json({
               message: "Article Updated",
               data: result,
          });
     })
     .catch(err => {
          next(err);
     });
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
               if(article.article_photo) removeImage(article.article_photo);
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

const removeImage = (filePath) => {
     filePath = path.join(__dirname, '../..', filePath);
     fs.unlink(filePath, err => console.log(err));
}