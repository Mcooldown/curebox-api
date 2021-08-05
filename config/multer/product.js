const multer = require('multer');

const productStorage = multer.diskStorage({
     destination: 'assets/products',
     filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
     }
});

const fileFilter = (req, file, cb) => {
     if(file.mimetype === 'image/png' || 
          file.mimetype === 'image/jpg' || 
          file.mimetype === 'image/jpeg'){
          cb(null, true);
     }else{
          cb(null, false);
     }
}

module.exports = multer({storage: productStorage, fileFilter: fileFilter}).single('productPhoto');
