const {validationResult} = require('express-validator');
const ForumHeader = require('../models/forumHeader');
const ForumDetail = require('../models/forumDetail');
const { cloudinary } = require('../../config/cloudinary');

exports.storeNewHeader = (req, res, next) => {

     const errors = validationResult(req);
     if(!errors.isEmpty()) res.status(400).send({message: "Invalid value", data: errors.array()});

     const uploadImagePromise = new Promise (async(resolve, reject) => {
          try{
               const uploadedResponse = await cloudinary.uploader.upload(req.body.forumPhoto, {
                    upload_preset: 'curebox',
               });
               resolve(uploadedResponse.url);
          }catch(err){
              resolve(500);
          }
     });

     uploadImagePromise
     .then((urlResult) => {

          const newHeader = new ForumHeader({
               user: req.body.userId,
               title: req.body.title,
               content: req.body.content,
               forumPhoto: urlResult !== 500 ? urlResult: null,
          });
          
          newHeader.save()
          .then(result => {
               res.status(201).json({
                    message: 'New Forum Created',
                    data: result
               });
          })
          .catch(err => {
               next(err);
          })
     } , (err) => console.log(err) );
}

exports.storeNewDetail = (req, res, next) => {
     
     const errors = validationResult(req);
     if(!errors.isEmpty()) res.status(400).send({message: "Invalid value", data: errors.array()});

     const uploadImagePromise = new Promise (async(resolve, reject) => {
          try{
               const uploadedResponse = await cloudinary.uploader.upload(req.body.forumPhoto, {
                    upload_preset: 'curebox',
               });
               resolve(uploadedResponse.url);
          }catch(err){
              resolve(500);
          }
     });

     uploadImagePromise
     .then((urlResult) => {
          const newForumDetail = new ForumDetail({
               forumHeader: req.params.forumHeaderId,
               user: req.body.userId,
               content: req.body.content,
               forumPhoto: urlResult !== 500 ? urlResult: null,
          });
          
          newForumDetail.save()
          .then(result => {
               res.status(201).json({
                    message: 'New Forum Detail Created',
                    data: result
               });
          })
          .catch(err => {
               next(err);
          })
     } , (err) => console.log(err) );
}

exports.getAllForumHeaders = (req, res, next) => {

     const perPage = req.query.perPage || 10;
     const currentPage = req.query.currentPage || 1;

     ForumHeader.find().countDocuments()
     .then(count => {
          totalData = count;
          return ForumHeader.find()
          .populate('user')
          .sort({createdAt: 'desc'})
          .skip((parseInt(currentPage)-1)*parseInt(perPage))
          .limit(parseInt(perPage));
     })
     .then(result => {
          res.status(200).json({
               message : "All Forum Header Fetched",
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

exports.getForumHeader = (req, res, next) => {
     ForumHeader.findById(req.params.forumHeaderId)
     .populate('user')
     .then(result => {
          if(!result) res.status(404).json({message: "Forum header not found"});
          else{
               res.status(200).json({
                    message: "Forum fetched",
                    data: result,
               })
          }
     })
     .catch(err =>{
          next(err);
     });
}

exports.getAllForumDetails = (req, res, next) => {

     ForumDetail.find({forumHeader: req.params.forumHeaderId}).countDocuments()
     .then(count => {
          totalData = count;
          return ForumDetail.find({forumHeader: req.params.forumHeaderId})
          .sort({createdAt: 'desc'})
          .populate('user');
     })
     .then(result => {
          res.status(200).json({
               message : "All Forum Detail Fetched",
               data: result,
               total_data: totalData,
          });
     })
     .catch(err => {
          next(err);
     });
}

exports.updateForumHeader = (req, res, next) => {
     
     const errors = validationResult(req);
     if(!errors.isEmpty()) res.status(200).json({message: "Invalid value", data: errors.array()});

     ForumHeader.findById(req.params.forumHeaderId)
     .then(forumHeader => {

          if(!forumHeader) res.status(404).json({message: "Forum header not found"});
          if(forumHeader.forumPhoto) removeImage(forumHeader.forumPhoto);
          
          forumHeader.title = req.body.title;
          forumHeader.content = req.body.content;
          if(req.file) forumHeader.forumPhoto = req.file.path;

          return forumHeader.save();
     })
     .then(result => {
          res.status(200).json({message: "Forum Header updated", data: result});
     })
     .catch(err => {
          next(err);
     });
}

exports.updateForumDetail = (req, res, next) => {
     
     const errors = validationResult(req);
     if(!errors.isEmpty()) res.status(200).json({message: "Invalid value", data: errors.array()});

     const uploadImagePromise = new Promise (async(resolve, reject) => {
          try{
               const uploadedResponse = await cloudinary.uploader.upload(req.body.forumPhoto, {
                    upload_preset: 'curebox',
               });
               resolve(uploadedResponse.url);
          }catch(err){
              resolve(500);
          }
     });

      uploadImagePromise
     .then((urlResult) => {
          const newImage = urlResult;
          const forumDetailId = req.params.forumDetailId;

          ForumDetail.findById(forumDetailId)
          .then(forumDetail =>{
               if(!forumDetail){
                    res.status(404).json({message: "Forum detail not found"});
               }else{
                    forumDetail.content = req.body.content;
                    forumDetail.forumPhoto = newImage !== 500 ? newImage : forumDetail.forumPhoto;
                    return forumDetail.save();
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

exports.deleteForumHeader = (req, res, next) => {

     ForumHeader.findById(req.params.forumHeaderId)
     .then(forumHeader => {
          if(!forumHeader) res.status(404).send({message: "Forum Header not found"});

          return ForumHeader.findByIdAndRemove(req.params.forumHeaderId);
     })
     .then(resultDeleteHeader => {
          return ForumDetail.deleteMany({forumHeader: req.params.forumHeaderId});
     })
     .then(resultDeleteDetail => {
          res.status(200).json({message: "Forum Header and details Deleted"});
     })
     .catch(err => {
          next(err);
     });
}

exports.deleteForumDetail = (req, res, next) => {
     
     ForumDetail.findById(req.params.forumDetailId)
     .then(forumDetail => {
          if(!forumDetail) res.status(404).send({message: "Forum Detail not found"});

          return ForumDetail.findByIdAndRemove(req.params.forumDetailId);
     })
     .then(result => {
          res.status(200).json({message: "Forum detail Deleted", data: result});
     })
     .catch(err => {
          next(err);
     });
}