const multer = require('multer');

const articleStorage = multer.diskStorage({
     destination: 'assets/articles',
     filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
     }
})

const fileFilter = (req, file, cb) => {
     if(file.mimetype === 'image/png' || 
          file.mimetype === 'image/jpg' || 
          file.mimetype === 'image/jpeg'){
          cb(null, true);
     }else{
          cb(null, false);
     }
}

module.exports = multer({storage: articleStorage, fileFilter: fileFilter}).single('articlePhoto');